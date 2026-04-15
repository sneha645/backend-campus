import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class UploadProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsString()
  @IsOptional()
  technologies!: string;

  @IsUrl()
  @IsOptional()
  projectUrl!: string;

  @IsUrl()
  @IsOptional()
  githubUrl!: string;

  @IsString()
  @IsNotEmpty()
  mentorId!: string;
}
