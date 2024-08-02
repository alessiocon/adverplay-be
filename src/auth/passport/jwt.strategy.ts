import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtUserDto } from './../../user/models/User.dto';
import { AuthService } from './../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtUserDto) {
    let dateNow = new Date();
    
    if(dateNow.getTime() > payload.exp * 1000){
      
      await this._authService.refreshToken(payload);
    }
    return payload;
  }
}