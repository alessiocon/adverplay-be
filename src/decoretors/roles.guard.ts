import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './custom.decoretor';
import { Request } from 'express';
import { JwtUserDto } from './../user/models/User.dto';

@Injectable()
export class RolesGuard implements CanActivate {
    //#roles:string[] = [];
    constructor(private reflector: Reflector) {}
    // constructor(roles :string[]){
    //     this.#roles = roles;
    // }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());

        const request = context.switchToHttp().getRequest() as Request;
        const user = request.user as JwtUserDto; 
        if (!user) {throw new UnauthorizedException("Permesso negato")}
        
        if (user.role.find(r => roles.find(c => c == r))){
            return true;
        }

        throw new UnauthorizedException("Permesso negato")
    }
}