import { Types } from "mongoose";

export enum EmailTypeEnum {
    generics,
    EmailConfirm,
    ChangePassword,
} 

export interface IEmailData {}

export class EmailConfirmData implements IEmailData {
    userId: Types.ObjectId
}
