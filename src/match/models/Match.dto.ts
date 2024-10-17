import { ApiProperty, PartialType } from "@nestjs/swagger";
import mongoose, { ObjectId, Schema } from "mongoose";

export class CreateMatchDto {
    @ApiProperty({required: false})
    idCode: mongoose.Types.ObjectId | undefined;
    @ApiProperty({required: true})
    idGevent: mongoose.Types.ObjectId;
    @ApiProperty({required:false})
    tryFA: number | undefined
}

export class CreateMatch extends CreateMatchDto {
    idUser: mongoose.Types.ObjectId;
}

export class EndMatchDto {
    @ApiProperty({required: true})
    idMatch: mongoose.Types.ObjectId;
    @ApiProperty({required: true})
    score: number;
}

export class EndMatch extends EndMatchDto {
    idUser: mongoose.Types.ObjectId;
}

export class EndMatchRes {
    hasWin: boolean;
}


export class UpdateMatchDto extends PartialType(CreateMatchDto) {}