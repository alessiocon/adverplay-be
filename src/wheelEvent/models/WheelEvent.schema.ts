import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

import { User } from './../../user/models/User.schema';

export type WheelEventDocument = HydratedDocument<WheelEvent>;


export class Aword {
    @Prop({required: true})
    name: string;
    @Prop({required: true, default: 1})
    qt: number;
    @Prop({required: true, default: 5})
    weight:number;
}


@Schema()
export class WheelEvent {
    _id: ObjectId;

    @Prop({unique:true})
    name: string;

    @Prop({default:""})
    description: string;

    @Prop({default: null})
    end: Date|null;

    @Prop({default:0})
    runGame: number;

    @Prop({default: 150})
    runMax: number;

    @Prop({type: [SchemaTypes.ObjectId], default: [], ref: User.name})
    staff:  ObjectId[];

    @Prop({type: [SchemaTypes.ObjectId], default: [], ref: User.name})
    master:  ObjectId[];
    
    @Prop({type: [Aword], default: []})
    awards:  Aword[];
}

export const WheelEventSchema = SchemaFactory.createForClass(WheelEvent);
