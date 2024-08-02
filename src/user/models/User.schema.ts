import { Prop, Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongo, SchemaType, SchemaTypes } from 'mongoose';
import { AuthRoleEnum } from './../../auth/models/Auth.dto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({unique:true})
    email: string;

    @Prop({default:false})
    isVerified: boolean;

    @Prop()
    password: string;

    @Prop({unique:true, maxlength: 15})
    username: string;

    @Prop({unique:true})
    tel: number;

    @Prop()
    role : AuthRoleEnum[]
}

export const UserSchema = SchemaFactory.createForClass(User);



/*
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
owner: Owner;

@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
owner: Owner[];

module
imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],

service
constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}
*/