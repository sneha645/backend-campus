import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class JobDto {
  @ApiProperty({ example: 'Senior Full Stack Engineer' })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'We are looking for a talented Senior Full Stack Engineer...',
  })
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Full-time' })
  @IsString()
  jobType!: string;

  @ApiProperty({ example: '5+ years' })
  @IsString()
  experience!: string;

  @ApiProperty({ example: '120000-150000' })
  @IsString()
  salary!: string;

  @ApiProperty({ example: ['React', 'Node.js', 'AWS'] })
  @IsArray()
  @IsString({ each: true })
  requirements!: string[];

  @ApiProperty({
    example: [
      'Develop and maintain web applications',
      'Collaborate with cross-functional teams',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  responsibilities!: string[];

  @ApiProperty({ example: ['Health insurance', '401(k)', 'Flexible hours'] })
  @IsArray()
  @IsString({ each: true })
  benefits!: string[];
}
