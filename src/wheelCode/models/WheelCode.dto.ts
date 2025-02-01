import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Schema } from "mongoose";

import { ConstraintEnum } from "./../../models/ConstraintEnum.model";

export class CreateWheelCodeReqDto {
    
    @ApiProperty({required:true})
    idWheelEvent: Schema.Types.ObjectId;
    idCreator: Schema.Types.ObjectId;
}

export class DeleteWheelCodeReqDto {
    @ApiProperty({required:true})
    idWheelEvent: Schema.Types.ObjectId;
    idCreator: Schema.Types.ObjectId;
}

export class UseWheelCodeDto {
    award: string 
}

export class CheckWheelCode {
    _id: Schema.Types.ObjectId;;
    code: string;
    award: string;
}

export class WheelCodeAssignDto {
    @ApiProperty({default:"A11A11", required:true})
    @Length(6,6, {message: ConstraintEnum.Length})
    code: string;
}

