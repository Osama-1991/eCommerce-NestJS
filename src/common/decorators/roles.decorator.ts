import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from 'src/DB/interfaces/user.interface';

export const rolesKey: string = 'roles';
export const Roles = (data: RoleTypes[]) => {
  return SetMetadata(rolesKey, data);
};
