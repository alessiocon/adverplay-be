import { Prop, SchemaFactory, Schema, } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import { EmailConfirmData, EmailTypeEnum, IEmailData } from './EmailModels';

export type EmailDocument = HydratedDocument<Email>;

@Schema()
export class Email{
    @Prop()
    type: EmailTypeEnum ;
    
    @Prop()
    data: EmailConfirmData;

    @Prop({default: new Date()})
    expireAt?: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email).index({expireAt: 1},{expireAfterSeconds: 60*24 /* 1 days */});