import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FeedbackDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  feedback_description: string;
}
