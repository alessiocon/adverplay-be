import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, ChangeUserPassDto } from './models/User.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/User.schema';
import mongoose, { Model} from 'mongoose';
import { EmailService } from './../email/email.service';
import { ResFetch } from './../models/Response.model';
const bcrypt = require('bcrypt');

export type UserMock = any;

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(User.name) private _userContext: Model<User>,
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
    let resEmail = await this._emailService.getUserIdFromMail(idMail);

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

  async changePassword(data: ChangeUserPassDto) : Promise<ResFetch<boolean>>{
    let response :ResFetch<boolean> = {};
    let resEmail = await this._emailService.getUserIdFromMail(data.idMail);

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
}