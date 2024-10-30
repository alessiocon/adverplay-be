import { Injectable } from '@nestjs/common';
import { CreateMatch, EndMatch, EndMatchRes } from './models/Match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchSchema } from './models/Match.schema';
import mongoose, { Model, Mongoose } from 'mongoose';
import { CodeService } from './../code/Code.service';
import { ResFetch } from './../models/Response.model';
import { GeventService } from './../gevent/Gevent.service';
import { Gevent, GeventSchema } from './../gevent/models/Gevent.schema';
import { Code } from './../../src/code/models/Code.schema';


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
    let code : ResFetch<Code>;

    let gevent = await this._geventService.FindById(createMatch.idGevent);
    if(!gevent.data) {
      res.error = gevent.error;
      return res;
    }

    code = await this._codeService.FindById(createMatch.idCode as mongoose.Types.ObjectId)
    if(!code.data) {
      res.error = code.error;
      return res;
    }
    

    if(code.data.maxTry <= code.data.try){
      res.error = {
        general: "hai superato i tentativi a disposizione",
        game: "hai utilizzato tutti le vite, per continuare cambia codice"
      };
      return res
    }

    code.data.try += 1;
    gevent.data.runGame += 1;

    await this._codeService.Update(code.data);
    await this._geventService.Update(gevent.data);

    /*dato che l'utente non avrà l'accesso , il sistema match è sospeso*/
    /*let createMatchDb = new this._matchContext({
      codeTry: gameTry,
      ...createMatch
    });
    await createMatchDb.save(); */
    res.data = "start play"//""+createMatchDb._id
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
