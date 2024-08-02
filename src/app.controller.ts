import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
    ) {}


//TODO: da cancellare
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({name:"RF_Token"})
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  Home(){
    return this.appService.getHello();
  }
}
