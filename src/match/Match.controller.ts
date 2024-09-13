import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MatchService } from './Match.service';
import { CreateMatch, CreateMatchDto, EndMatch, EndMatchDto, EndMatchRes } from './models/Match.dto';
import { JwtAuthGuard } from './../auth/passport/jwt-auth.guard';
import { ResFetch } from './../models/Response.model';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  create(@Body() createMatchDto: CreateMatchDto, @Req() req) : Promise<ResFetch<string>>{
    var createMatch : CreateMatch = {...createMatchDto/*, idUser: req.user._id*/};

    return this.matchService.Create(createMatch);
  }

  @Post("end")
  @UseGuards(JwtAuthGuard)
  endMatch(@Body() endMatchDto: EndMatchDto, @Req() req) : Promise<ResFetch<EndMatchRes>>{
    var endMatch : EndMatch = {...endMatchDto, idUser: req.user._id}

    return this.matchService.EndMatch(endMatch);
  }

  // @Get()
  // findAll() {
  //   return this.matchService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.matchService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  //   return this.matchService.update(+id, updateMatchDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matchService.remove(+id);
  // }
}

