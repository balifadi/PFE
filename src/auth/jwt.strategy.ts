import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY', // 🔐 نفس المفتاح في UserModule
    });
  }

  async validate(payload: any) {
    // 🔥 البيانات اللي ترجع هنا تمشي لـ request.user

    return {
      iduser: payload.iduser,   // ✅ مهم باش يتوافق مع باقي الكود
      email: payload.email,
      role: payload.role,    // ✅ مهم للـ RolesGuard
    };
  }
}