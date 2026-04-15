import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
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

  @ApiProperty({ example: 'student' })
  @IsString()
  role!: string;

  @ApiProperty({ example: '1st Year' })
  @IsString()
  year!: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  branch!: string;
}
