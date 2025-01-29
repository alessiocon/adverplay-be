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

export class WheelBSProp{
    @Prop()
    width: number;
    @Prop()
    color:string
}

export class CPage {
    @Prop()
    bg: string;
    @Prop()
    text: string;
    @Prop()
    btnBg: string;
    @Prop()
    btnT: string;
    @Prop()
    btnB: string;

    @Prop()
    inputBg: string;
    @Prop()
    inputT: string;
    @Prop()
    inputB: string;
    @Prop()
    labelT: string;
    @Prop()
    listHBg: string;
    @Prop()
    listFBg: string;
    @Prop()
    listSBg: string;
    @Prop()
    listHT: string;
    @Prop()
    listFT: string;
    @Prop()
    listST: string;

    @Prop({type: [String], default: []})
    wheelBg: string[];
    @Prop({type: [String], default: []})
    wheelTC: string[];
    @Prop()
    wheelFF: string;
    @Prop()
    wheelFS: number;
    @Prop()
    wheelOBW: number;
    @Prop()
    wheelOBC: string;
    @Prop()
    wheelRLW: number;
    @Prop()
    wheelRLC: string;
    @Prop()
    wheelSpeen: number;
    @Prop({type: [Aword], default: []})
    wheelBS: {width: number, color:string}
    @Prop()
    wheelImgWhite: boolean;
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

    @Prop({type: CPage , default: {}})
    cPage: CPage
}

export const WheelEventSchema = SchemaFactory.createForClass(WheelEvent);
