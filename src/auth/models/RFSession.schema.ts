import { Prop, SchemaFactory, Schema, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';

export type RFSessionDocument = HydratedDocument<RFSession>;

@Schema()
export class RFSession{
    @Prop({unique: true})
    idUser: mongoose.Types.ObjectId;

    @Prop()
    round: number;

    @Prop({default: new Date()})
    expireAt?: Date;
}

export const RFSessionSchema = SchemaFactory.createForClass(RFSession).index({expireAt: 1},{expireAfterSeconds: 60*24*7 /* 7 days */});