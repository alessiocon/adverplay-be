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
    @Prop({type: SchemaTypes.ObjectId, ref: User.name, required:true})
    idCreator: ObjectId;

    @Prop({default: Date.now()})
    createdAt: Date
    
}

export const CodeSchema = SchemaFactory.createForClass(Code);