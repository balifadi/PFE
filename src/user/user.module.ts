import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';           // ✅ Ajouté
import { Client } from '../entities/client.entity';         // ✅ Ajouté
import { HotelManager } from '../entities/hotel-manager.entity'; // ✅ Ajouté
import { AgenceManager } from '../entities/agence-manager.entity'; // ✅ Ajouté
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Admin,          // ✅ Ajouté
      Client,         // ✅ Ajouté
      HotelManager,   // ✅ Ajouté
      AgenceManager,  // ✅ Ajouté
    ]),
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, RolesGuard],
  exports: [UserService, JwtModule],
})
export class UserModule {}