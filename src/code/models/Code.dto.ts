import { ApiProperty } from "@nestjs/swagger";
import { Length , Max, Min, IsEmail} from "class-validator";
import mongoose, { ObjectId, Schema } from "mongoose";
import { ConstraintEnum } from "./../../models/ConstraintEnum.model";

export class CreateCodeReqDto {
    @Min(0, {message: ConstraintEnum.Min})
    @Max(15, {message: ConstraintEnum.Max})
    maxTry: number|undefined;

    idGevent: mongoose.Types.ObjectId;

    @ApiProperty({required:false})
    idCreator: ObjectId;
}

export class CreateCodeReqFADto{
    @IsEmail({},{message: ConstraintEnum.IsEmail})
    creatorFA: string;
    idGevent: mongoose.Types.ObjectId;
}

export class AddCodeResDto {
    _id: string;
    code: string;
    try: number;
    maxTry: number;
    //idPlayer: string;
    scoreToWin: number;
}

export class GetCodeDto {
    code: string;
    try: number;
    maxTry: number;
    player: string|null;
    scoreToWin: number;
}

export class CodeAssignDto {
    @ApiProperty({default:"A11A11", required:true})
    @Length(6,6, {message: ConstraintEnum.Length})
    code: string;
}

