import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CodeService } from './Code.service';
import { AddCodeResDto, CodeAssignDto, CreateCodeReqDto, GetCodeDto } from "./models/Code.dto"
import { ResFetch } from './../models/Response.model';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';
import mongoose, { ObjectId, Schema } from 'mongoose';
import { ApiParam } from '@nestjs/swagger';
import { Roles } from './../decoretors/custom.decoretor';
import { AuthRoleEnum } from './../auth/models/Auth.dto';
import { RolesGuard } from './../decoretors/roles.guard';
import { JwtUserDto } from './../user/models/User.dto';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}


  @Post()
  @UseGuards(RolesGuard)
  @Roles([AuthRoleEnum.Restaurateur,AuthRoleEnum.Staff])
  @UseGuards(JwtAuthGuard)
  async Create(@Req() req, @Body() createCodeDto: CreateCodeReqDto) : Promise<ResFetch<string>> {
    createCodeDto.idCreator = req.user._id;

    return await this.codeService.Create(createCodeDto);
  }

  @Post("assign")
  @UseGuards(JwtAuthGuard)
  async AssignCode(@Req() req,  @Body() data: CodeAssignDto) : Promise<ResFetch<AddCodeResDto>> {

    return await this.codeService.AssignCode(data.code, req.user as JwtUserDto);
  }

  @ApiParam({name:"id", type: "string"})
  @Get(":id")
  async getCodeById(@Param('id') codeId: mongoose.Types.ObjectId) : Promise<ResFetch<GetCodeDto>> {

    return await this.codeService.GetCodeById(codeId);
  }

  @ApiParam({name:"idCode", type: "string"})
  @UseGuards(JwtAuthGuard)
  @Get(":idCode/canplay")
  async CanPlay(@Req() req, @Param('idCode') IdCode: string) : Promise<ResFetch<boolean>> {
    
    let IdCodeObject = new mongoose.Types.ObjectId(IdCode);
    return await this.codeService.CanPlay(IdCodeObject, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({name:"idCode", type: "string"})
  @ApiParam({name:"score", type: "number"})
  @Get(":idCode/checkwin/:score")
  async CheckWin(@Param('idCode') IdCode: Schema.Types.ObjectId, @Param('score') score: number) : Promise<ResFetch<boolean>> {
    
    return await this.codeService.CheckWin(IdCode, score);
  }


  @Delete(':id')
  async Remove(@Param('id') codeId: ObjectId) : Promise<ResFetch<boolean>> {
    return await this.codeService.Remove(codeId);
  }

  // @Post()
  // create(@Body() createCodeDto: CreateCodeDto) {
  //   return this.codeService.create(createCodeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.codeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.codeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCodeDto: UpdateCodeDto) {
  //   return this.codeService.update(+id, updateCodeDto);
  // }


}
