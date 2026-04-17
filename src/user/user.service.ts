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
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(HotelManager)
    private hotelManagerRepository: Repository<HotelManager>,

    @InjectRepository(AgenceManager)
    private agenceManagerRepository: Repository<AgenceManager>,

    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(createUserDto: CreateUserDto): Promise<any> {

    const { nom, prenom, email, password, telephone, role } = createUserDto;

    if (!this.allowedRoles.includes(role))
      throw new ForbiddenException('Rôle invalide');

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ForbiddenException('Email déjà utilisé');

    const hash = await bcrypt.hash(password, 10);

    const data = {
      nom,
      prenom,
      email,
      password: hash,
      telephone
    };

    let savedUser: any;

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

  // ================= LOGIN =================
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return user;
  }

  generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.iduser,
      email: user.email,
      role: user.role
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);

    return {
      access_token: this.generateToken(user),
      nom: user.nom,
      prenom: (user as any).prenom,
      email: user.email,
      telephone: (user as any).telephone,
      role: user.role as any,
    };
  }

  // ================= PROFILE UPDATE =================
  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.findOneBy({ iduser: userId });
    if (!user) throw new NotFoundException('User not found');

    delete updateUserDto.role;

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(userId, updateUserDto);

    return {
      message: 'Profil mis à jour avec succès'
    };
  }

  // ================= ADMIN =================
  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'admin')
      throw new ForbiddenException('Admins only');

    return this.userRepository.find();
  }

  async findOne(id: number, currentUser: User): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ iduser: id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    if (currentUser.role !== 'admin')
      throw new ForbiddenException('Admins only');

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number, currentUser: User) {
    if (currentUser.role !== 'admin')
      throw new ForbiddenException('Admins only');

    const user = await this.userRepository.findOneBy({ iduser: id });
    if (!user) throw new NotFoundException('User not found');

    switch (user.role) {
      case 'admin':
        await this.adminRepository.delete(id);
        break;
      case 'client':
        await this.clientRepository.delete(id);
        break;
      case 'hotel-manager':
        await this.hotelManagerRepository.delete(id);
        break;
      case 'agence-manager':
        await this.agenceManagerRepository.delete(id);
        break;
    }

    return { message: 'Deleted successfully' };
  }

  async findUsersByRole(role: string, currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'admin')
      throw new ForbiddenException('Admins only');

    return this.userRepository.find({ where: { role } });
  }

  async findUserByRoleAndId(role: string, id: number, currentUser: User): Promise<User> {
    if (currentUser.role !== 'admin')
      throw new ForbiddenException('Admins only');

    const user = await this.userRepository.findOne({ where: { iduser: id, role } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}