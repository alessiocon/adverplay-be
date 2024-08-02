import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtUserDto } from './../user/models/User.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RFSession } from './models/RFSession.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { ResFetch } from './../models/Response.model';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
    @InjectModel(RFSession.name) private _RFSessionContext: Model<RFSession>
  ) {}

  async validateUser(email: string, pass: string): Promise<ResFetch<JwtUserDto>> {
    let response : ResFetch<JwtUserDto> = {
      error:{ general: "email o password sbagliata", game: "email o password sbagliata"}
    };
    
    email = email.toLocaleLowerCase();
    const user = await this._userService.findByEmail(email);
    if(user){
      if(!user.isVerified){
        await this._userService.sendConfirmEmail(email);
        response.error =  {
          email: "Ti abbiamo inviato una mail per confermare la tua identità",
          game: "Ti abbiamo inviato una mail per confermare la tua identità"
        };

      }else{
        if(await bcrypt.compare(pass, user.password)){
          const jwtUser: JwtUserDto = {
            email: user.email, 
            username: user.username,
            role: user.role,
            _id: user._id,
            round: 0
          };

          response.data =  jwtUser; 
          response.error = null;
        }
      }
    }
    return response;
  }

  async login(payload: JwtUserDto) : Promise<string> {
    let jwtToken = await this._jwtService.signAsync(payload);
    this.logger.log(`find and delete from RFSession idUser: ${payload._id}`);
    await this._RFSessionContext.findOneAndDelete({idUser: payload._id});
    
    await new this._RFSessionContext({
      idUser: payload._id,
      round: 0
    }).save();
    this.logger.log(`save in RFSession idUser: ${payload._id}`);
    return jwtToken;
  }


  async refreshToken(payload: JwtUserDto){
    let response : ResFetch<string> = {};
    
    let rfSession = await this._RFSessionContext.findOne({idUser: new mongo.ObjectId(payload._id.toString()) });
    if(!rfSession){
      throw new UnauthorizedException({
        general: "sessione scaduta, ricarica la pagina",
        reload: true,
        customObject: true
      })
    }else{

      if(rfSession.round !== payload.round){
        await rfSession.deleteOne();
        throw new UnauthorizedException({ 
            general: "sessione scaduta, ricarica la pagina",
            reload: true,
            customObject: true
        })
  
      }else{
        rfSession.round = payload.round = ++payload.round;
        let {iat, exp, ...data} = payload

        await rfSession.save();
        response.data = await this._jwtService.signAsync(data);
      }
    }
    return response;
  }

  async logout(userid: mongoose.Types.ObjectId){
    let response : ResFetch<boolean> = {};

    await this._RFSessionContext.findOneAndDelete({idUser: new mongoose.Types.ObjectId(userid)});
    response.data = true;
    return response;
  }

}
