import { Injectable } from '@nestjs/common';
import { CreateMatch, EndMatch, EndMatchRes } from './models/Match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchSchema } from './models/Match.schema';
import mongoose, { Model, Mongoose } from 'mongoose';
import { CodeService } from './../code/Code.service';
import { ResFetch } from './../models/Response.model';
import { GeventService } from './../gevent/Gevent.service';
import { Gevent, GeventSchema } from './../gevent/models/Gevent.schema';


@Injectable()
export class MatchService {

  constructor(
    private _codeService: CodeService,
    private _geventService: GeventService,
    @InjectModel(Match.name) private _matchContext: Model<Match>,
    // @InjectModel(Code.name) private _codeContext: Model<Code>,
    // private _codeService: CodeService
  ) {}


  async Create(createMatch: CreateMatch) : Promise<ResFetch<string>>{
    let res : ResFetch<string> = {};
    let gameTry = createMatch.tryFA || 0;
    let gameMaxTry = 0;

    console.log(createMatch)

    let gevent = await this._geventService.FindById(createMatch.idGevent);
    if(!gevent.data) {
      res.error = gevent.error;
      return res;
    }

    let code = await this._codeService.FindById(createMatch.idCode);
    
    if(!gevent.data.FA){
      if(!code.data) {
        res.error = code.error;
        return res;
      }
      gameTry = code.data.try;
      gameMaxTry = code.data.maxTry;
    }
    

    
    if(gameMaxTry <= gameTry){
      res.error = {
        general: "hai superato i tentativi a disposizione",
        game: "hai utilizzato tutti le vite, per continuare cambia codice"
      };
      return res
    }

 
    gameTry += 1;
    gevent.data.runGame += 1;


    if(!gevent.data.FA){ 
      code.data.try = gameTry;
      await this._codeService.Update(code.data);
    }
    await this._geventService.Update(gevent.data);


    let createMatchDb = new this._matchContext({
      codeTry: gameTry,
      ...createMatch
    });
    await createMatchDb.save(); 
    res.data = ""+createMatchDb._id
    return res;
  }


  async EndMatch(endMatch: EndMatch) : Promise<ResFetch<EndMatchRes>>{
    let res : ResFetch<EndMatchRes> = {};

    let matchDb = await this._matchContext.findById(endMatch.idMatch)
      .populate<{"idGevent": Gevent}>(MatchSchema.paths.idGevent.path, `${GeventSchema.paths.scoreToWin.path}`);

    if(!matchDb){
      res.error = {
        general: "partita non trovata",
        game: "partita non trovata"
      }
    }

    if(""+matchDb.idUser != endMatch.idUser.toString()){
      res.error = {
        general: "permesso negato per questa partita",
        game: "permesso negato per questa partita"
      }
    }

    matchDb.score = endMatch.score;
    matchDb.endAt = Date.now();
    await matchDb.save();

    res.data = {
      hasWin: matchDb.score >= matchDb.idGevent.scoreToWin
    };
    
    return res;
  }
  

  // findAll() {
  //   return `This action returns all match`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} match`;
  // }

  // update(id: number, updateMatchDto: UpdateMatchDto) {
  //   return `This action updates a #${id} match`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} match`;
  // }
}
