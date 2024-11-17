import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, ObjectId , SchemaTypes } from 'mongoose';
import { Code } from './../../code/models/Code.schema';
import { Gevent } from './../../gevent/models/Gevent.schema';
import { User } from './../../user/models/User.schema';

export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
    _id: ObjectId;

    @Prop({default:0})
    score: number;

    @Prop({required: true})
    codeTry: number;

    @Prop({default: Date.now})
    createdAt: Number

    @Prop({default: null})
    endAt: Number|null

    @Prop({type: SchemaTypes.ObjectId, ref: Code.name, required:true})
    idCode: ObjectId;

    @Prop({type: SchemaTypes.ObjectId, ref: Gevent.name, required:true})
    idGevent: ObjectId;

    @Prop({type: SchemaTypes.ObjectId, ref: User.name, required:true})
    idUser: ObjectId | null;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
