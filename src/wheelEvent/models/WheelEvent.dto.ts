import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from '@nestjs/mapped-types';
import { ObjectId} from 'mongoose'

import { Aword, CPage } from "./WheelEvent.schema";
import { CheckWheelCode } from "./../../wheelCode/models/WheelCode.dto";

const cPageDefault : CPage = {
    bg: "#f7f7f8",
    text: "#343434",
    btnBg: "#343434",
    btnT: "#f7f7f8",
    btnB: "2px solid #343434",
    inputBg: "#cee5f2",
    inputT: "#343434",
    inputB: "2px solid #cee5f2",
    labelT: "#343434",
    listHBg: "#637081",
    listFBg: "#f7f7f8",
    listSBg: "#cee5f2",
    listHT: "#f7f7f8",
    listFT: "#343434",
    listST: "#343434",
    wheelBg: ['#343434', '#cee5f2'],
    wheelTC: ["#ffffff","#343434"],
    wheelFF: "Helvetica",
    wheelFS: 32,
    wheelOBW: 3,
    wheelOBC: "#343434",
    wheelRLW: 2,
    wheelRLC: "#343434",
    wheelSpeen: 1,
    wheelBS: {
        width: 15,
        color: "rgba(73, 73, 73, 0.15)"
    },
    wheelImgWhite: false
} 


export class CreateWheelEventDto {
    @ApiProperty({default:"NumberOne PUB ruota della fortuna"})
    name: string;

    @ApiProperty({default:"fai 20€ di spesa e ricevi la possibilità di vincere uno dei fantastici premi"})
    description: string;

    @ApiProperty({default:[{name:"panino", qt:10, weight:10 }, {name:"spa", qt:5, weight:3 }, {name:"viaggio", qt:3, weight:2 }, {name:"bevanda", qt:10, weight:10 }]})
    awards: Aword[]
    
    @ApiProperty({default:new Date(new Date().getTime()+1000*60*60*24)})
    end: Date

    @ApiProperty({type: CPage , default: cPageDefault})
        cPage: CPage
}

export class UpdateWheelEventDto extends PartialType(CreateWheelEventDto) {}

export class GetWheelEventDto{
    _id: ObjectId;
    
    name: string;

    description: string;

    end: Date|null;

    runGame: number;

    runMax: number;

    staff:  ObjectId[];

    master:  ObjectId[];
    
    awards:  Aword[];

    codes:  CheckWheelCode[];

    cPage: CPage
}