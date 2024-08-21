import { Types } from "mongoose";

export enum EmailTypeEnum {
    generics,
    EmailConfirm,
    EmailChange,
    ChangePassword,

} 

export class EmailData {
    [name: string] : string|number|Types.ObjectId
}

export class EmailConfirmData extends EmailData {
    userId: Types.ObjectId;
}

export class EmailChangeData extends EmailData {
    userId: Types.ObjectId;
    newEmail: string;
}
