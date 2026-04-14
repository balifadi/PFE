import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 🔥 نجيبو roles المطلوبة من decorator
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // إذا ما فماش roles → مسموح
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🔥 تحقق من role
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès refusé');
    }

    return true;
  }
}
