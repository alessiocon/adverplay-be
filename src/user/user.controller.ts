import { Controller, Get, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangeUserPassDto, ChangeUsernameDto, JwtUserDto, ChangeEmailDto, SendChangeEmailDto, ChangeOldPasswordDto } from './models/User.dto';
import { ResFetch } from './../models/Response.model';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResFetch<boolean>>{
    return this.userService.create(createUserDto);
  }

  @Get("confirmemail/:idmail")
  async confirmEmail(@Param("idmail") idMail: string) : Promise<ResFetch<boolean>>{
    return this.userService.confirmEmail(idMail);
  }

  @Post("changepass")
  async changePassword(@Body() data: ChangeUserPassDto) : Promise<ResFetch<boolean>>{
    return this.userService.changePassword(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("changeusername")
  async changeUsername(@Body() data: ChangeUsernameDto, @Req() req , @Res({passthrough:true}) res) : Promise<ResFetch<boolean>>{
    let response : ResFetch<boolean> = {data: false};

    let resJwt = await this.userService.ChangeUsername(data.Username, req.user as JwtUserDto)
    if(!resJwt.error){
      res.cookie('Jwt_User' ,'Bearer ' + resJwt.data, { 
        sameSite: "Lax", 
        secure: process.env.NODE_ENV !== "development",
        domain: process.env.NODE_ENV !== "development" ? process.env.CLIENTDOMAIN  : "/"
      });
      
      response.data = true;
    }else{
      response.error = resJwt.error;
    }
    
    return response;
  }

  @Post("changeemail")
  async changEmail(@Body() data: ChangeEmailDto, @Req() req , @Res({passthrough:true}) res) : Promise<ResFetch<boolean>>{
    return await this.userService.ChangeEmail(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("changeoldpassword")
  async changeOldPassword(@Body() data: ChangeOldPasswordDto, @Req() req){

    return await this.userService.ChangeOldPassword(data, req.user._id);
  }

  @Get("sendconfirmemail/:useremail")
  async sendConfirmEmail(@Param("useremail") userEmail: string) : Promise<ResFetch<boolean>>{
    return this.userService.sendConfirmEmail(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post("sendchangeemail")
  async sendChangEmail(@Body() data: SendChangeEmailDto, @Req() req, @Res({passthrough:true}) res) : Promise<ResFetch<boolean>>{
    let response = await this.userService.SendChangeEmail(data.Email, req.user as JwtUserDto);
    if(response.data){
      res.cookie('Jwt_User' ,'', { 
        sameSite: "Lax", 
        secure: process.env.NODE_ENV !== "development",
        domain: process.env.NODE_ENV !== "development" ? process.env.CLIENTDOMAIN  : "/",
        expires: new Date()
      });
    }
    return response;
  }

  @Get("sendrecoverypassword/:useremail")
  async sendRecoveryPassword(@Param("useremail") userEmail: string) : Promise<ResFetch<boolean>>{
    return this.userService.sendRecoveryPassword(userEmail);
  }

  @Get("dataprivate")
  @UseGuards(JwtAuthGuard)
  async GetDataPrivate(@Req() req): Promise<ResFetch<{user: string}>>{
    var response : ResFetch<{user: string}> = {};
    
    if(req.user){
      response = {data: {user: req.user.username}};
    }else{
      req.error = {game: "utente non trovato"}
    }

    return response;
  }



  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
