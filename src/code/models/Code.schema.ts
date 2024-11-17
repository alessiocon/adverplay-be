import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Schema as SchemaMongo, SchemaTypes } from 'mongoose';
import { Gevent } from './../../gevent/models/Gevent.schema';
import { User } from './../../user/models/User.schema';

export type CodeDocument = HydratedDocument<Code>;

@Schema()
export class Code {
    _id: ObjectId;
    
    @Prop({unique:true})
    code: string;

    @Prop({default:0})
    try: number;

    @Prop({default:0})
    maxTry: number;
    
    @Prop({type: SchemaTypes.ObjectId, ref: Gevent?.name ?? "Gevent", default: null})
    idGevent: ObjectId;

    @Prop({type: SchemaTypes.ObjectId, ref: User.name, default:null})
    idPlayer: mongoose.Types.ObjectId | null;

    //creator of code
    @Prop({type: SchemaTypes.ObjectId, ref: User.name, default:null})
    idCreator: ObjectId | null;

    //creator of code in FreeAccess mode
    @Prop({default: null})
    creatorFA: string | null;

    @Prop({default: Date.now})
    createdAt: Date;
 
}

export const CodeSchema = SchemaFactory.createForClass(Code).index({createdAt: 1},{name: "expireAt", expireAfterSeconds: 60*60*12 /* 12 ore */})
