import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubmitAssignmentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  assignment_id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  assignment_description: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  assignment_assignto: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  assignment_deadline: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  submissiontype: string;
}
