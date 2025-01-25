import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { Schema } from "mongoose";

import { Aword } from "./WheelEvent.schema";

export class CreateWheelEventDto {
    @ApiProperty({default:"NumberOne PUB ruota della fortuna"})
    name: string;

    @ApiProperty({default:"fai 20€ di spesa e ricevi la possibilità di vincere uno dei fantastici premi"})
    description: string;

    @ApiProperty({default:[{name:"panino", qt:10, weight:5 }, {name:"spa", qt:5, weight:10 }, {name:"viaggi", qt:3, weight:5 }]})
    awards: Aword[]
    
    @ApiProperty({default:new Date(new Date().getTime()+1000*60*60*24)})
    end: Date
}

export class UpdateWheelEventDto extends PartialType(CreateWheelEventDto) {}