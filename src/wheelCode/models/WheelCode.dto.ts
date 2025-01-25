import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { ObjectId, Schema } from "mongoose";

import { ConstraintEnum } from "./../../models/ConstraintEnum.model";

export class CreateWheelCodeReqDto {

    idWheelEvent: Schema.Types.ObjectId;

    @ApiProperty({required:false})
    idCreator: ObjectId;
}

export class UseWheelCodeDto {
    award: string 
}

export class WheelCodeAssignDto {
    @ApiProperty({default:"A11A11", required:true})
    @Length(6,6, {message: ConstraintEnum.Length})
    code: string;
}

