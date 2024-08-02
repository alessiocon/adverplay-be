import { ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private _authService: AuthService,
  ) {super()}

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }
    
  handleRequest(err, user, info, ctx) {
    let res = ctx.getResponse();
    if (err || !user) {
      res.cookie('Jwt_User' ,'', { expires: new Date()});
      throw err || new UnauthorizedException({
        general: "accedi per continuare",
        customObject: true
      });
    }

    if(user.newJwt){
      res.cookie('Jwt_User' ,'Bearer ' + user.newJwt);
    }

    let {newJwt, ...dataUser} = user
    return dataUser;
  }
}
