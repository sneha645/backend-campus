import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from "class-validator";

export class AuthDto {
    @ApiProperty({ example: 'johndoe@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    password: string;
}