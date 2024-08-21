import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, Length, Matches } from "class-validator";
import mongoose, { ObjectId, Schema } from "mongoose";
import { AuthRoleEnum } from "./../../auth/models/Auth.dto";
import { ConstraintEnum } from "./../../models/ConstraintEnum.model";

export class CreateUserDto {
    @ApiProperty({default:"userNew", required:true})
    @Length(3,15, {message: ConstraintEnum.Length})
    username: string;
    
    @ApiProperty({default:"alessioconforto13@gmail.com", required:true})
    @IsEmail({},{message: ConstraintEnum.IsEmail})
    email: string;

    @ApiProperty({default:"pas12Word!", required:true})
    @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[\W]){8,20})/, {message: ConstraintEnum.Marches})
    pass: string;

    @ApiProperty({default:"3206111214", required:true})
    @IsPhoneNumber("IT",{message: ConstraintEnum.IsPhoneNumber})
    tel: string;
}

export class ChangeUserPassDto {
    @ApiProperty()
    idMail: string;
    
    @ApiProperty()
    @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[\W]){8,20})/, {message: ConstraintEnum.Marches})
    newPass: string;
}

export class ChangeUsernameDto {
    @ApiProperty()
    @Length(3,15, {message: ConstraintEnum.Length})
    Username: string;
}

export class SendChangeEmailDto {
    @ApiProperty()
    @IsEmail({},{message: ConstraintEnum.IsEmail})
    Email: string;
}

export class ChangeEmailDto {
   password: string;
   idMail: mongoose.Types.ObjectId;
}

export class ChangeOldPasswordDto {
    password: string;
    @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[\W]){8,20})/, {message: ConstraintEnum.Marches})
    newPassword: string;
 }

export class JwtUserDto {
    username: string;
    _id: mongoose.Types.ObjectId;
    role: AuthRoleEnum[];
    email: string;
    round: number;

    exp?: number;
    iat?: number;
    newJwt?: string;
}