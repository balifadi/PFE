import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(userData: Partial<User>): Promise<User> {
    try {
      if (!userData.password) {
        throw new Error('Password is required');
      }

      const hash = await bcrypt.hash(userData.password, 10);

      const newUser = this.userRepository.create({
        ...userData,
        password: hash,
      });

      return await this.userRepository.save(newUser);

    } catch (error) {
      console.error('Register error:', error.message);
      throw error;
    }
  }

  // ================= VALIDATE =================
  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const { password: _, ...result } = user;
    return result;
  }

  // ================= LOGIN =================
  async login(user: any) {
    const payload = {
      sub: user.iduser,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ================= PROFILE =================
  async getProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { iduser: userId },
    });
  }

  // ================= CRUD =================
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ iduser: id });
  }

  async update(id: number, data: Partial<User>) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.userRepository.update(id, data);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
