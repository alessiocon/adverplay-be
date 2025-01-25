import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema } from 'mongoose';

import { WheelCode, WheelCodeSchema } from './models/WheelCode.schema';
import { CreateWheelCodeReqDto, UseWheelCodeDto } from "./models/WheelCode.dto"
import { WheelEventService } from './../wheelEvent/WheelEvent.service';
import { ResFetch } from './../models/Response.model';
import { WheelEvent, WheelEventSchema } from './../wheelEvent/models/WheelEvent.schema';

@Injectable()
export class WheelCodeService {
  constructor(@InjectModel(WheelCode.name) private _wheelCodeContext: Model<WheelCode>,
    @Inject(forwardRef(() => WheelEventService)) private _wheelEventService: WheelEventService,
  ) {}

  async Create(createWheelCodeDto: CreateWheelCodeReqDto) : Promise<ResFetch<string>>{
    let res : ResFetch<string> = {};

    let wheelEvent = await this._wheelEventService.FindById(createWheelCodeDto.idWheelEvent);
    if(wheelEvent.data?.staff?.includes(createWheelCodeDto.idCreator) || 
      wheelEvent.data?.master.includes(createWheelCodeDto.idCreator)
    ){
      let  createWheelCode = new this._wheelCodeContext({
        code: this.GenerateWheelCode(),
        ...createWheelCodeDto
      });
      
      await createWheelCode.save();
      res.data = createWheelCode.code;
    }else{
      res.error = {general: "Non puoi creare codici in questo evento"}
    }
    
    return res;
  }

//NotInUse
  async FindById(idWheelCode: mongoose.Types.ObjectId) : Promise<ResFetch<WheelCode>>{
    let res : ResFetch<WheelCode> = {};

    res.data = await this._wheelCodeContext.findById( idWheelCode );
      // .populate<{"idGevent": Gevent}>(WheelCodeSchema.paths.idGevent.path, GeventSchema.paths._id.path)
      // .populate<{"idPlayer": User}>(WheelCodeSchema.paths.idPlayer.path, UserSchema.paths._id.path);

      if(!res.data){
        res.error = {
          general: "Codice non trovato",
          game: "Codice non trovato"
        }
      }
      return res;
  }

  async Update(wheelCode : WheelCode) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: true};
    let {_id, ...wheelCodeDate} = wheelCode;

    await this._wheelCodeContext.findOneAndUpdate({_id}, wheelCodeDate);
    return res;
  } 

  async UseWheelCode(wheelCode: string) : Promise<ResFetch<UseWheelCodeDto>>{
    let res : ResFetch<UseWheelCodeDto> = {};

    let wheelCodeDb = await  this._wheelCodeContext.findOne( {code: wheelCode})
      .populate<{"idWheelEvent": WheelEvent}>(WheelCodeSchema.paths.idWheelEvent.path, 
        `${WheelEventSchema.paths.awards.path} ${WheelEventSchema.paths.runGame.path} ${WheelEventSchema.paths.runMax.path}`)


    if(!wheelCodeDb){
      res.error = {
        general: "Codice non trovato",
        game: "Codice non trovato"
      }
    }else if(wheelCodeDb.idWheelEvent === null){
      res.error = {
        general: "Evento non trovato o cancellato",
        game: "Evento non trovato o cancellato"
      }
    }else if(wheelCodeDb.idWheelEvent.awards.length === 0){
      res.error = {
        general: "Non ci sono premi in palio",
        game: "Non ci sono premi in palio"
      }
    }else if(wheelCodeDb.idWheelEvent.runGame >= wheelCodeDb.idWheelEvent.runMax){
      res.error = {
        general: "Questo evento è terminato",
        game: "Questo evento è terminato"
      }
    }

    if(res.error) return res;


    let awardsList = wheelCodeDb.idWheelEvent.awards.map((x) => { return { ...x}});
    let totWeight = 0;
    let awardWin = "riprova";

    wheelCodeDb.idWheelEvent.awards.map((x) => { totWeight += x.weight;});
    awardsList.push({
      name: "riprova",
      qt: 1000,
      weight: 100 - totWeight
    })

    let listOfFortune = [];
    let isfullList = false;
    do{
      isfullList = true
      awardsList.forEach(element => {
          if(element.weight > 0){
              isfullList = false;
              listOfFortune.push(element.name);
              element.weight -= 1;
          }
      })
    }while(!isfullList)
    
    
    let getAward = listOfFortune[Math.floor(Math.random() * 100)];

    wheelCodeDb.idWheelEvent.awards.forEach(element => {
        if(element.name === getAward){
            if(element.qt > 0){
              element.qt -= 1;
              awardWin = getAward;
            }
        }
    })
    
    //save
    wheelCodeDb.idWheelEvent.runGame += 1;
    await this._wheelEventService.Update(wheelCodeDb.idWheelEvent);
    await wheelCodeDb.deleteOne();
    res.data = {award: awardWin};
    return res;
  }

  findAll() {
    return `This action returns all WheelCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} WheelCode`;
  }

  //NOTINUSE
  async Remove(wheelCodeId: Schema.Types.ObjectId) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data:true}
    await this._wheelCodeContext.findByIdAndDelete(wheelCodeId);

    return res;
  }

  private GenerateWheelCode() : string {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F','G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X','Y', 'Z']

    let wheelCode = ( alphabet[Math.floor(Math.random() * (26 - 0 + 1) + 0)] ?? 'A')
      + (Math.floor(Math.random() * 10) + 10) 
      + (alphabet[Math.floor(Math.random() * (26 - 0 + 1) + 0)] ?? 'V')
      + (Math.floor(Math.random() * 10) + 10);


    return wheelCode;
  }
}
