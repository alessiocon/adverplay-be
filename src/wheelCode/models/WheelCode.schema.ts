import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { User } from './../../user/models/User.schema';
import { WheelEvent } from './../../wheelEvent/models/WheelEvent.schema';

export type WheelCodeDocument = HydratedDocument<WheelCode>;

@Schema()
export class WheelCode {
    _id: ObjectId;
    
    @Prop({unique:true})
    code: string;
    
    @Prop({type: SchemaTypes.ObjectId, ref: WheelEvent?.name ?? "WheelEvent", default: null})
    idWheelEvent: ObjectId;

    @Prop({default:null})
    award: string|null;

    //creator of code
    @Prop({type: SchemaTypes.ObjectId, ref: User.name, default:null})
    idCreator: ObjectId | null;

    @Prop({default: Date.now})
    createdAt: Date;
}

export const WheelCodeSchema = SchemaFactory.createForClass(WheelCode).index({createdAt: 1},{name: "expireAt", expireAfterSeconds: 60*60*12 /* 12 ore */})
