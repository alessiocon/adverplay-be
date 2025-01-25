import { Controller, Get, Post, Body, Param, UseGuards, Req} from '@nestjs/common';
import { GeventService } from './Gevent.service';
import { CreateGeventDto, CheckWinGEventDto, CheckFreeAccessDto} from './models/Gevent.dto';
import { ResFetch } from './../models/Response.model';
import { Gevent } from './models/Gevent.schema';
import { Schema } from 'mongoose';
import { ApiBearerAuth, ApiHeader, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';
import { Roles } from './../decoretors/custom.decoretor';
import { RolesGuard } from './../decoretors/roles.guard';
import { AuthRoleEnum } from './../auth/models/Auth.dto';

@Controller('gevent')
export class GeventController {
  constructor(private readonly geventService: GeventService) {}
  
  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @Roles([AuthRoleEnum.Admin])
  @UseGuards(JwtAuthGuard)
  async Create(@Body() createGeventDto: CreateGeventDto) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {};

    let data = await this.geventService.Create(createGeventDto);

    res.data = data;
    return res
  }

  @Get(':name')
  async FindByName(@Param('name') name: string) : Promise<ResFetch<Gevent>> {
    const event = await this.geventService.FindByName(name);
    
    let res : ResFetch<Gevent> = {};

    if(!event){
      res.error = {general: 'l\'evento selezionato non esiste'};
    }

    res.data = event;
    return  res;

  }

  @Get(':name/src')
  async GetSurceByName(@Param('name') name: string) : Promise<ResFetch<string>>{

    const srcEvent = await this.geventService.GetSurceGame(name);

    let res :  ResFetch<string> = {
      data: srcEvent
    }
    return  res;
  }

  
  @Get()
  async FindAll() : Promise<ResFetch<[Gevent]>> {
    let res : ResFetch<[Gevent]> = {};
    let data = await this.geventService.FindAll();

    res.data = data;
    
    return res
  }

  @Get(':idEvent/checkFA')
  async CheckFreeAccess(@Param('idEvent') idEvent: Schema.Types.ObjectId) : Promise<ResFetch<CheckFreeAccessDto>> {
    let res = await this.geventService.CheckFreeAccess(idEvent);

    return res
  }
  
  @ApiParam({name: 'idGevent', type: "string" })
  @Post(':idGevent/checkWin')
  async CheckWin(@Param("idGevent") idGevent : Schema.Types.ObjectId , @Body() checkWin: CheckWinGEventDto) : Promise<ResFetch<boolean>> {

    let res : ResFetch<boolean> = await this.geventService.CheckWin(idGevent, checkWin.code, checkWin.score);;
    return res;
  }

  // @ApiParam({name: 'idGevent', type: "string" })
  // @Get(':idGevent/findwinner')
  // async FindWinner(@Param("idGevent") idGevent : Schema.Types.ObjectId, @Query() query) : Promise<ResFetch<WinnerDto[]>> {
    
  //   let res : ResFetch<WinnerDto[]> = await this.geventService.FindWinner(idGevent, query) ;
  //   return res;
  // }

  // @ApiParam({name: 'idGevent', type: "string" })
  // @Post(':idGevent/setwinner')
  // @Roles([AuthRoleEnum.Admin, AuthRoleEnum.Restaurateur, AuthRoleEnum.Staff])
  // @UseGuards(JwtAuthGuard)
  // async SetWinner(@Req() req,@Param("idGevent") idGevent : Schema.Types.ObjectId , @Body() setWinnerDto: WinnerDto) : Promise<ResFetch<boolean>> {
  //   let setWinner = {...setWinnerDto, idStaff: req.user._id}

  //   let res : ResFetch<boolean> = await this.geventService.SetWinner(idGevent, setWinner);
  //   return res;
  // }


/*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }*/
}
