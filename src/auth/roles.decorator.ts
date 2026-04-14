import { SetMetadata } from '@nestjs/common';

// 🔥 هذا decorator باش نحددو roles (admin, client...)
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);