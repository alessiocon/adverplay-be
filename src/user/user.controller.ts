import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangeUserPassDto } from './models/User.dto';
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


  @Get("sendconfirmemail/:useremail")
  async sendConfirmEmail(@Param("useremail") userEmail: string) : Promise<ResFetch<boolean>>{
    return this.userService.sendConfirmEmail(userEmail);
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
