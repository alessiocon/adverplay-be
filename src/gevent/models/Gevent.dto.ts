import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { Schema } from "mongoose";

export class CheckWinGEventDto {
    @ApiProperty()
    code: Schema.Types.ObjectId;

    @ApiProperty()
    score: number;
}


export class SetWinnerDto {
    @ApiProperty()
    code: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    withdrawn: boolean
}

export class SetWinner extends SetWinnerDto{
    idStaff: Schema.Types.ObjectId
}

export class WinnerDto {
    @ApiProperty()
    code: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    withdrawn: boolean;
}

export class CreateGeventDto {
    @ApiProperty({default:"evento prova"})
    name: string;

    @ApiProperty({default:"Prova a vincere un magnifico panino raggiungendo il punteggio stabilito, hai a disposizione cinque tentativi, buona fortuna e buon appetito"})
    description: string;

    @ApiProperty({default:"<h1>Evento Prova</h1><p>descrizione semplice dell'evento, vediamo cosa ne esce fuori</p>"})
    desHtml: string;
    
    @ApiProperty({default:"https://html-classic.itch.zone/html/10310518/game/index.html"})
    src: string;
    
    @ApiProperty({default:new Date()})
    start: Date;
    
    @ApiProperty({default:new Date(new Date().getTime()+1000*60*60*24)})
    end: Date

    @ApiProperty({default: 100})
    scoreToWin: number;

    @ApiProperty({default: 10})
    maxTry: number;

    @ApiProperty({default: false})
    FA: boolean;
}

export class CheckFreeAccessDto {
    FA: boolean;
    scoreToWin: number;
    maxTry: number;
}

export class UpdateGEventDto extends PartialType(CreateGeventDto) {}