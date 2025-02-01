import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { WheelCodeService } from './WheelCode.service';
import { CreateWheelCodeReqDto, DeleteWheelCodeReqDto, UseWheelCodeDto } from "./models/WheelCode.dto"
import { ResFetch } from './../models/Response.model';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';
import { Roles } from './../decoretors/custom.decoretor';
import { AuthRoleEnum } from './../auth/models/Auth.dto';
import { RolesGuard } from './../decoretors/roles.guard';

@Controller('wheelcode')
export class WheelCodeController {
  constructor(private readonly wheelCodeService: WheelCodeService) {}

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @Roles([AuthRoleEnum.Restaurateur,AuthRoleEnum.Staff])
  @UseGuards(JwtAuthGuard)
  async Create(@Req() req, @Body() createWheelCodeDto: CreateWheelCodeReqDto) : Promise<ResFetch<string>> {
    createWheelCodeDto.idCreator = req.user._id;

    return await this.wheelCodeService.Create(createWheelCodeDto);
  }

  @ApiParam({name:"id", type: "string"})
  @Get(":wheelcode/use")
  async useWheelCode(@Param('wheelcode') wheelcode: string) : Promise<ResFetch<UseWheelCodeDto>> {

    return await this.wheelCodeService.UseWheelCode(wheelcode);
  }

  @Delete(':id')
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  async Remove(@Req() req, @Param('id') codeId: ObjectId, @Body() deleteWheelCodeDto: DeleteWheelCodeReqDto ) : Promise<ResFetch<boolean>> {
    deleteWheelCodeDto.idCreator = req.user._id;
    return await this.wheelCodeService.Remove(codeId, deleteWheelCodeDto);
  }

}
