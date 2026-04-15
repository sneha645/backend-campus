import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

export class CreateMentorDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'computer science' })
  @IsString()
  department!: string;

  @ApiProperty({ example: 'DSA' })
  @IsString()
  specialization!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  experience!: number;

  @ApiProperty({ example: 'mentor' })
  @IsString()
  role!: string;
}
