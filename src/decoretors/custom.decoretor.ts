import { AuthRoleEnum } from './../auth/models/Auth.dto';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
//export const Roles = (...roles: AuthRoleEnum[]) => SetMetadata(ROLES_KEY, roles);
export const Roles = Reflector.createDecorator<AuthRoleEnum[]>();