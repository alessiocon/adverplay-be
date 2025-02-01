import { Controller, Get, Post, Body, Param, UseGuards} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { WheelEventService } from './WheelEvent.service';
import { CreateWheelEventDto, GetWheelEventDto} from './models/WheelEvent.dto';
import { ResFetch } from './../models/Response.model';
import { WheelEvent } from './models/WheelEvent.schema';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';
import { Roles } from './../decoretors/custom.decoretor';
import { RolesGuard } from './../decoretors/roles.guard';
import { AuthRoleEnum } from './../auth/models/Auth.dto';

@Controller('wheelevent')
export class WheelEventController {
  constructor(private readonly wheelEventService: WheelEventService) {}
  
  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @Roles([AuthRoleEnum.Admin])
  @UseGuards(JwtAuthGuard)
  async Create(@Body() createWheelEventDto: CreateWheelEventDto) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {};

    let data = await this.wheelEventService.Create(createWheelEventDto);

    res.data = data;
    return res
  }

  @Get()
  async FindAll() : Promise<ResFetch<[WheelEvent]>> {
    let res : ResFetch<[WheelEvent]> = {};
    let data = await this.wheelEventService.FindAll();

    res.data = data;
    
    return res
  }

  @Get(':name')
  async FindByName(@Param('name') name: string) : Promise<ResFetch<GetWheelEventDto>> {
    const event = await this.wheelEventService.FindByName(name);
    
    let res : ResFetch<GetWheelEventDto> = {};

    if(!event){
      res.error = {general: 'l\'evento selezionato non esiste'};
    }

    res.data = event;
    return  res;

  }
}
