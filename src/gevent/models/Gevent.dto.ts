import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { Schema } from "mongoose";

export class CheckWinGEventDto {
    @ApiProperty()
    code: Schema.Types.ObjectId;

    @ApiProperty()
    score: number;
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
}

export class UpdateGEventDto extends PartialType(CreateGeventDto) {}