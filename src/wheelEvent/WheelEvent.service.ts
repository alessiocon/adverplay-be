import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

import { CreateWheelEventDto } from './models/WheelEvent.dto';
import { WheelEvent } from './models/WheelEvent.schema';
import { CodeService } from './../code/Code.service';
import { ResFetch } from './../models/Response.model';
import { Code } from './../code/models/Code.schema';


@Injectable()
export class WheelEventService {

  constructor(
    @InjectModel(WheelEvent.name) private _wheelEventContext: Model<WheelEvent>,
    @InjectModel(Code.name) private _codeContext: Model<Code>,
    @Inject(forwardRef(() => CodeService)) private _codeService: CodeService
   
  ) {}

  async FindAll() : Promise<[WheelEvent]> {
    let events =   await this._wheelEventContext.find<WheelEvent>().limit(10) as [WheelEvent];
    return events;
  }

  async FindByName(name: string) : Promise<WheelEvent> {
    let  WheelEventByName = await this._wheelEventContext.findOne({name: `${name}`});
    
    return WheelEventByName;
  }

  //NOTINUSE
  async FindById(id: Schema.Types.ObjectId) : Promise<ResFetch<WheelEvent>> {
    let res : ResFetch<WheelEvent> = {} 
    res.data = await this._wheelEventContext.findById(id);

    if(!res.data){
      res.error = {
        general: "Evento non trovato",
        game: "Evento non trovato"
      }
    }
    
    return res;
  }

  async Create(createWheelEventDto: CreateWheelEventDto) : Promise<boolean> {
  
    let  createWheelEvent = new this._wheelEventContext({...createWheelEventDto});

    await createWheelEvent.save();
    return true;
  }


  async Update(WheelEvent : WheelEvent) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: true};
    let {_id, ...WheelEventData} = WheelEvent;
    
    await this._wheelEventContext.findOneAndUpdate({_id}, WheelEventData);
    return res;
  }
}
