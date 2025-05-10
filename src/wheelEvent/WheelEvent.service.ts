import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

import { CreateWheelEventDto, GetWheelEventDto } from './models/WheelEvent.dto';
import { WheelEvent, WheelEventSchema } from './models/WheelEvent.schema';
import { CodeService } from './../code/Code.service';
import { ResFetch } from './../models/Response.model';
import { Code } from './../code/models/Code.schema';
import { WheelCode, WheelCodeSchema } from './../wheelCode/models/WheelCode.schema';


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

  async FindBySlug(slug: string) : Promise<GetWheelEventDto> {
    let  wheelEventDb = await this._wheelEventContext.findOne({slug: slug})
      .populate<{"idCodes": WheelCode[]}>(WheelEventSchema.paths.idCodes.path, 
        `${WheelCodeSchema.paths.code.path} 
          ${WheelCodeSchema.paths.award.path}`
      );

    let wheelEvent : GetWheelEventDto = {
      _id: wheelEventDb._id,
      name: wheelEventDb.name,
      description: wheelEventDb.description,
      slug: wheelEventDb.slug,
      end: wheelEventDb.end,
      runGame: wheelEventDb.runGame,
      runMax: wheelEventDb.runMax,
      staff: wheelEventDb.staff,
      master: wheelEventDb.master,
      awards: wheelEventDb.awards,
      cPage: wheelEventDb.cPage,
      codes: wheelEventDb.idCodes
    }

    return wheelEvent;
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
