import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateStudentProfileDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1st Year' })
  @IsString()
  year: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  branch: string;
}
