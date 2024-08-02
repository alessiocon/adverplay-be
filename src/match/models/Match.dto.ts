import { ApiProperty, PartialType } from "@nestjs/swagger";
import mongoose, { ObjectId, Schema } from "mongoose";

export class CreateMatchDto {
    @ApiProperty({required: true})
    idCode: mongoose.Types.ObjectId;
    @ApiProperty({required: true})
    idGevent: mongoose.Types.ObjectId;
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