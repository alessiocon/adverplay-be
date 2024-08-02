import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as SchemaMongo, SchemaTypes } from 'mongoose';
import { User } from './../../user/models/User.schema';

export type GeventDocument = HydratedDocument<Gevent>;

@Schema()
export class Gevent {
    _id: ObjectId;

    @Prop({unique:true})
    name: string;

    @Prop({default:""})
    description: string;

    @Prop({default:""})
    desHtml: string;

    @Prop({default:""})
    src: string;

    @Prop({default:new Date()})
    start: Date;
    @Prop({default: null})
    end: Date|null;

    @Prop({default:0})
    runGame: number;

    @Prop({default:100})
    scoreToWin: number;

    @Prop({type: [SchemaTypes.ObjectId], default: [], ref: User.name})
    staff:  ObjectId[];

    //capire sé è utile includerla
    // @Prop({type: [SchemaTypes.ObjectId], default: [], ref: Code.name})
    // codes: ObjectId[]
}

export const GeventSchema = SchemaFactory.createForClass(Gevent);
