import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MentorService } from './mentor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Mentor')
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiOperation({ summary: 'Get all mentors' })
  @ApiResponse({ status: 200, description: 'List of mentors' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMentors(): Promise<any> {
    return this.mentorService.getAllMentors();
  }
}
