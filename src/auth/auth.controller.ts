import { Controller, Post, Body, Res, Get, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLocalGameLoginOutDto, AuthLocalLoginDto } from './models/Auth.dto';
import { ResFetch } from './../models/Response.model';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { JwtUserDto } from './../user/models/User.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('local')
  async authLocal( @Res({passthrough:true}) res, @Body() credentials: AuthLocalLoginDto) : Promise<ResFetch<boolean>>
  { 
    const resFetch : ResFetch<boolean> = {data: false} ;
    let userVal = await this.authService.validateUser(credentials.email, credentials.pass);
    
    if(!userVal.data){
      resFetch.error = userVal.error;
    }else{
      let token = await this.authService.login(userVal.data);
      res.cookie('Jwt_User' ,'Bearer ' + token, { 
        sameSite: "Lax", 
        secure: process.env.NODE_ENV !== "development",
        domain: process.env.NODE_ENV !== "development" ? process.env.CLIENTDOMAIN  : "/"
      });

      resFetch.data = true;
    }
    return resFetch;
  }

  @Post('localgame')
  async authLocalGame( @Res({passthrough:true}) res, @Body() credentials: AuthLocalLoginDto) : Promise<ResFetch<AuthLocalGameLoginOutDto>>
  { 
    const resFetch : ResFetch<AuthLocalGameLoginOutDto> = {} ;
    let userVal = await this.authService.validateUser(credentials.email, credentials.pass);
    
    if(userVal.error){
      resFetch.error = userVal.error;
      return resFetch;
    }

    let token = await this.authService.login(userVal.data);

    resFetch.data = {
      jwt:'Bearer ' + token,
      username: userVal.data.username,
    }
    return resFetch;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout( @Res({passthrough:true}) res,@Req() req) : Promise<ResFetch<boolean>>
  { 
    const resFetch : ResFetch<boolean> = {data: false} ;
    const user : JwtUserDto = req.user;

    await this.authService.logout( user._id );
    res.cookie('Jwt_User' ,'', { 
      sameSite: "Lax", 
      secure: process.env.NODE_ENV !== "development",
      domain: process.env.NODE_ENV !== "development" ? process.env.CLIENTDOMAIN  : "/",
      expires: new Date()
    });

    resFetch.data = true;
     
    return resFetch;
  }
 }
