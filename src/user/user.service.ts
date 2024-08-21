import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, ChangeUserPassDto, JwtUserDto, ChangeEmailDto, ChangeOldPasswordDto } from './models/User.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/User.schema';
import mongoose, { Model} from 'mongoose';
import { EmailService } from './../email/email.service';
import { AuthService } from './../auth/auth.service';

import { ResFetch } from './../models/Response.model';
import { EmailChangeData } from './../email/models/EmailModels';
const bcrypt = require('bcrypt');

export type UserMock = any;

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(User.name) private _userContext: Model<User>,
    @Inject(forwardRef(() => AuthService)) private _authService : AuthService,
    private _emailService : EmailService
  ) {}

  async create(user: CreateUserDto): Promise<ResFetch<boolean>>{
      let response: ResFetch<boolean> = {data:false};
    
      const saltRounds = +process.env.BCRTPT_SALT;
      const passCrypt = await bcrypt.hash(user.pass, saltRounds);

      user.email = user.email.toLocaleLowerCase();

      let  createUser = new this._userContext({...user, password:passCrypt});
      await createUser.save();
  
      let emailRes = await this._emailService.sendConfirmEmail(user.email, createUser._id);
      if(!emailRes.data){
        response.error = emailRes.error;
      }else{
        response.data = true;
      }
      return response
  };

  async findByEmail(email: string): Promise<User & {_id: mongoose.Types.ObjectId}  | undefined> {
    this.logger.log(`find user with email ${email}`);

    return await this._userContext.findOne({email: email});
  }

  async confirmEmail(idMail: string) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};
    let resEmail = await this._emailService.getUserIdByMail(idMail);

    if(!resEmail.error){
      let user = await this._userContext.findById(resEmail.data);
      if(!user){
        response.error = {general: "Utente non trovato"};
      }else{
        user.isVerified = true;
        await user.save();
        response.data = true;
      }
    }else{
      response.error = resEmail.error;
    }

    return response;
  }

  async sendConfirmEmail(userEmail: string) : Promise<ResFetch<boolean>>{
    let response: ResFetch<boolean> = {}; 
    const user = await this._userContext.findOne({email: userEmail}).select("_id isVerified");

    if(!user){
      response.error ={general: "utente non trovato"};

    }else if(user.isVerified){
      response.error ={general: "richiesta di conferma email ad un utente già confermato"};

    }else{
      let emailRes = await this._emailService.sendConfirmEmail(userEmail, user._id);

      if(!emailRes.data){
        response.error = emailRes.error;

      }else{
        response.data = true;
      }
    }
    return response;
  }

  async sendRecoveryPassword(userEmail: string) : Promise<ResFetch<boolean>>{
    let response: ResFetch<boolean> = {}; 
    const user = await this._userContext.findOne({email: userEmail}).select("_id email");

    if(!user){
      response.error ={general: "utente non trovato"};

    }else{
      let emailRes = await this._emailService.sendRecoveryPassword(userEmail, user._id);

      if(!emailRes.data){
        response.error = emailRes.error;

      }else{
        response.data = true;
      }
    }
    return response;
  }

  async SendChangeEmail(email: string, userJwt: JwtUserDto,) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};

    let user = await this._userContext.findById(userJwt._id);
    
    if(!user){ response.error = {general: "utente non trovato"}}
    else{
      await this._emailService.sendChangeEmail(email, userJwt._id);
      response.data = true;
    }

    return response;
  }

  async changePassword(data: ChangeUserPassDto) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};
    let resEmail = await this._emailService.getUserIdByMail(data.idMail);

    if(!resEmail.error){
      let user = await this._userContext.findById(resEmail.data);
      if(!user){
        response.error = {general:"utente non trovato"};
      }else{
        const saltRounds = +process.env.BCRTPT_SALT;
        const passCrypt = await bcrypt.hash(data.newPass, saltRounds);
        user.password = passCrypt;
        
        await user.save();
        response.data = true;
      }
    }else{
      response.error = resEmail.error;
    }

    return response;
  }

  async ChangeUsername(username: string, userJwt: JwtUserDto) : Promise<ResFetch<string>>{
    let response :ResFetch<string> = {};

    let user = await this._userContext.findById(userJwt._id);
    let toFastChange = false;

    if(!user){
      response.error = {general: "utente non trovato"}
    }else if(user.changeUsername !== null){
      const actualDate = new Date().getTime();
      toFastChange = actualDate < user.changeUsername.getTime() + (1000*60*60*24*15);
    }

    if(toFastChange){
      let date = user.changeUsername;
      let dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      response.error = {Username: `Username cambiato meno di quindici giorni fa (${dateFormatted})`}
    }else{
      user.username = userJwt.username = username;
      user.changeUsername = new Date();

      await user.save();
      
      const {exp, iat, newJwt, ...value} = userJwt 
      response.data = await this._authService.login(value);
    }

    return response;
  }

  async ChangeEmail(data: ChangeEmailDto) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};

    let resEmail = await this._emailService.getEmailById(data.idMail.toString());
    if(resEmail.error){
      response.error = resEmail.error;
      return response;
    }

    let user = await this._userContext.findById((resEmail.data.data as EmailChangeData).userId);
    if(!user){
      response.error = {general: "utente non trovato"};
      return response;
    }
    if(await bcrypt.compare(data.password, user.password)){
      user.email = (resEmail.data.data as EmailChangeData).newEmail;
      await user.save()
      response.data = true;
    }else{
      response.error = {password: "password non valida"};
      return response;
    }
    
    return response;
  }

  async ChangeOldPassword(data: ChangeOldPasswordDto, idUser: string) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};

    let user = await this._userContext.findById(idUser);
    if(!user){
      response.error = {general: "utente non trovato"};
      return response;
    }
    
    if(await bcrypt.compare(data.password, user.password)){
      user.password = await bcrypt.hash(data.newPassword, +process.env.BCRTPT_SALT);
      await user.save()
      response.data = true;

    }else{
      response.error = {password: "password non valida"};
      return response;
    }
    
    return response;
  }


}