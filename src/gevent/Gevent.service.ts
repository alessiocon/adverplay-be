import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CheckFreeAccessDto, CreateGeventDto, SetWinner, WinnerDto } from './models/Gevent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gevent } from './models/Gevent.schema';
import mongoose, { Model, ObjectId, Schema } from 'mongoose';
import { CodeService } from './../code/Code.service';
import { ResFetch } from './../models/Response.model';
import { Code } from './../code/models/Code.schema';


@Injectable()
export class GeventService {

  constructor(
    @InjectModel(Gevent.name) private _geventContext: Model<Gevent>,
    @InjectModel(Code.name) private _codeContext: Model<Code>,
    @Inject(forwardRef(() => CodeService)) private _codeService: CodeService
   
  ) {}

  async FindAll() : Promise<[Gevent]> {
    let events =   await this._geventContext.find<Gevent>().limit(10) as [Gevent];
    return events;
  }

  async FindByName(name: string) : Promise<Gevent> {
    let  geventByName = await this._geventContext.findOne({name: `${name}`});
    
    return geventByName;
  }

  async FindById(id: mongoose.Types.ObjectId) : Promise<ResFetch<Gevent>> {
    let res : ResFetch<Gevent> = {} 
    res.data = await this._geventContext.findById(id);

    if(!res.data){
      res.error = {
        general: "Evento non trovato",
        game: "Evento non trovato"
      }
    }
    
    return res;
  }

  async Create(createGeventDto: CreateGeventDto) : Promise<boolean> {
  
    let  createGevent = new this._geventContext({...createGeventDto});

    await createGevent.save();
    return true;
  }


  async GetSurceGame(name: string) : Promise<string> {
    let  geventByName = await this._geventContext.findOne<{_id:ObjectId, src:string}>({name: `${name}`}).select("src");
    return geventByName.src;
  } 


  async CheckWin(idGevent: Schema.Types.ObjectId, idCode: Schema.Types.ObjectId, score: number ) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: false};
    let gevent = await this._geventContext.findById(idGevent);

    if(!gevent){
      throw new BadRequestException("Event not found");
    }

    let code = await this._codeContext.findById(idCode);
    if(!code){
      throw new BadRequestException("Code not found");
    }
    
    if(gevent.scoreToWin < score){
      res.data = true;
    }

    return res;
  } 

  async Update(gevent : Gevent) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: true};
    let {_id, ...geventData} = gevent;
    
    await this._geventContext.findOneAndUpdate({_id}, geventData);
    return res;
  }

  async CheckFreeAccess(id : Schema.Types.ObjectId) : Promise<ResFetch<CheckFreeAccessDto>> {
    let res : ResFetch<CheckFreeAccessDto> = {};
    
    let gevent = await this._geventContext.findById(id);
    if(!gevent){
      throw new BadRequestException("Event not found");
    }

    res.data = {
      FA: gevent.FA,
      maxTry: gevent.maxTry,
      scoreToWin: gevent.scoreToWin
    }

    return res;
  } 

  async CheckWinner(id : Schema.Types.ObjectId, code: string) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: false};

    res.data = (await this._geventContext.find({_id: id ,winner:{$elemMatch: {code}}}).select("_id winner")).length !== 0;
    
    return res;
  } 

  async AddWinner(id : Schema.Types.ObjectId, code: string, score: number) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: false};

    let geventDb = await this._geventContext.findById(id).select("_id winner scoreToWin");
    if(!geventDb){
      throw new BadRequestException("Event not found");
    }

    let codeDb = await this._codeContext.findOne({code}).select("code creatorFA");
    if(!code){
      throw new BadRequestException("Code not found");
    }
    
    if(geventDb.scoreToWin <= score){
      //insert winner
      geventDb.winner.push({email:codeDb.creatorFA , code: codeDb.code, withdrawn:false});
      await geventDb.save();
      res.data = true;
    }

    return res;
  } 

  async FindWinner(id : Schema.Types.ObjectId, code: string, email: string) : Promise<ResFetch<WinnerDto>> {
    let res : ResFetch<WinnerDto> = {};

    let geventDb = await this._geventContext.findById(id).select("_id winner");
    if(!geventDb){
      throw new BadRequestException("Event not found");
    }

    let winner = geventDb.winner.find(x => x.code === code && x.email.toLocaleLowerCase() === email.toLocaleLowerCase());
    if(winner){
      res.data = winner;
    }else{
      res.error = {
        general:"vincita non trovata"
      }
    }
    
    return res;
  } 


  async SetWinner(id : Schema.Types.ObjectId, winner: SetWinner) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: true};
    let updateWinner = await this._geventContext.updateOne(
      {
        _id: id,
        staff: [winner.idStaff],
        winner: { $elemMatch: { code: winner.code, email: winner.email.toLocaleLowerCase() } }
      },
      { $set: { "winner.$.withdrawn" : winner.withdrawn} }
    )

    if(updateWinner.matchedCount === 0){
        res = {
          data: false,
          error:{
            general:"vincita non trovata"
          }
        }
    }
    return res;
  } 
/*
  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }

  */
}
