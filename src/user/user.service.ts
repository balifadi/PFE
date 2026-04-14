import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { AgenceManager } from '../entities/agence-manager.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class UserService {
  private allowedRoles = ['admin', 'client', 'hotel-manager', 'agence-manager'];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,       // ✅ Ajouté

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,     // ✅ Ajouté

    @InjectRepository(HotelManager)
    private hotelManagerRepository: Repository<HotelManager>, // ✅ Ajouté

    @InjectRepository(AgenceManager)
    private agenceManagerRepository: Repository<AgenceManager>, // ✅ Ajouté

    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { nom, email, password, role } = createUserDto;

    if (!this.allowedRoles.includes(role)) throw new ForbiddenException('Rôle invalide');

    if (!nom || !/^[A-Za-z][A-Za-z ]*$/.test(nom)) {
      throw new ForbiddenException('Le nom ne doit pas être vide, ne doit pas commencer par un chiffre');
    }

    if (!email || !/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+.(com|net|org)$/.test(email)) {
      throw new ForbiddenException('Email invalide');
    }

    if (!password || !/^[A-Za-z0-9]+$/.test(password)) {
      throw new ForbiddenException('Le mot de passe doit contenir uniquement lettres et chiffres');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ForbiddenException('Email déjà utilisé');

    const hash = await bcrypt.hash(password, 10);
    const data = { nom, email, password: hash };

    let savedUser: any;

    // ✅ Chaque rôle utilise son propre repository → TypeORM stocke la bonne valeur dans 'role'
    switch (role) {
      case 'admin':
        savedUser = await this.adminRepository.save(this.adminRepository.create(data));
        break;
      case 'client':
        savedUser = await this.clientRepository.save(this.clientRepository.create(data));
        break;
      case 'hotel-manager':
        savedUser = await this.hotelManagerRepository.save(this.hotelManagerRepository.create(data));
        break;
      case 'agence-manager':
        savedUser = await this.agenceManagerRepository.save(this.agenceManagerRepository.create(data));
        break;
    }

    const { password: pwd, ...result } = savedUser;
    return result;
  }

  // ================= VALIDATE =================
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return user;
  }

  // ================= LOGIN =================
  generateToken(user: User): string {
    const payload = { sub: user.iduser, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    const access_token = this.generateToken(user);
    return {
      access_token,
      nom: user.nom,
      email: user.email,
      role: user.role as any,
    };
  }

  // ================= ADMIN ONLY =================
  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.userRepository.find();
  }

  async findOne(id: number, currentUser: User): Promise<User | null> {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    const user = await this.userRepository.findOneBy({ iduser: id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    if (updateUserDto.role && !this.allowedRoles.includes(updateUserDto.role)) {
      throw new ForbiddenException('Rôle invalide');
    }
    if (updateUserDto.password) {
      if (!/^[A-Za-z0-9]+$/.test(updateUserDto.password)) {
        throw new ForbiddenException('Le mot de passe doit contenir uniquement lettres et chiffres');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number, currentUser: User) {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.userRepository.delete(id);
  }

  async findUsersByRole(role: string, currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    if (!this.allowedRoles.includes(role)) throw new ForbiddenException('Rôle invalide');
    return this.userRepository.find({ where: { role } });
  }

  async findUserByRoleAndId(role: string, id: number, currentUser: User): Promise<User> {
    if (currentUser.role !== 'admin') throw new ForbiddenException('Admins only');
    if (!this.allowedRoles.includes(role)) throw new ForbiddenException('Rôle invalide');
    const user = await this.userRepository.findOne({ where: { iduser: id, role } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}