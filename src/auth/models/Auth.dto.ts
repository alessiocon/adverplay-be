import { ApiProperty } from "@nestjs/swagger";
import { IsEmail} from "class-validator";
import { ConstraintEnum } from "./../../models/ConstraintEnum.model";

export class AuthLocalLoginDto {
    @ApiProperty({default:"alessioconforto20@gmail.com"})
    @IsEmail({},{message: ConstraintEnum.IsEmail})
    email: string;

    @ApiProperty({default:"Password1!"})
    pass: string;
}


export class AuthLocalGameLoginOutDto {
    jwt: string;
    username: string;
}

export enum AuthRoleEnum {
    Admin = "admin",
    Staff = "staff",
    Restaurateur = "restaurateur"
}