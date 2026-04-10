import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from "class-validator";

export class CreateStudentDto {

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'johndoe@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'student' })
    @IsString()
    role: string;
}