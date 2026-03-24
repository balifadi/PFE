import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
imports: [
TypeOrmModule.forFeature([User]),

// JWT configuration  
JwtModule.register({  
  secret: 'SECRET_KEY', // 🔐 بدّلها في production  
  signOptions: { expiresIn: '1h' },  
}),

],

controllers: [UserController],

providers: [
UserService,
JwtStrategy, // 🔥 مهم للـ Guard
],

exports: [
UserService,
JwtModule, // 🔥 باش modules آخرين ينجموا يستعملوه
],
})
export class UserModule {}