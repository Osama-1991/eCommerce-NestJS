import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { AuthenticationGuard } from '../guard/authentication/authentication.guard';
import { AuthorizationGuard } from '../guard/authorization/authorization.guard';
import { RoleTypes } from 'src/DB/interfaces/user.interface';

export function Auth(roles: RoleTypes[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
