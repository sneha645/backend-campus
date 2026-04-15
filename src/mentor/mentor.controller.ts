import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MentorService } from './mentor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AssignmentDto } from 'src/dtos/assignment.dto';
import { FeedbackDto } from 'src/dtos/feedback.dto';

@ApiTags('Mentor')
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @UseGuards(JwtAuthGuard)
  @Get('projects')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllProjects(@Request() req: any): Promise<any> {
    return this.mentorService.getAllProjects(req.user.userId);
  }

  @Patch('approveProject/:id')
  @ApiOperation({ summary: 'Approve project' })
  @ApiResponse({ status: 200, description: 'Project approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveProject(
    @Param('id') id: string,
    @Body() dto: { status: 'approved' | 'rejected'; feedback: string },
  ): Promise<any> {
    return this.mentorService.approveProject(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('internships')
  @ApiOperation({ summary: 'Get all internships' })
  @ApiResponse({ status: 200, description: 'List of internships' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllInternships(@Request() req: any): Promise<any> {
    return this.mentorService.getAllInternships(req.user.userId);
  }

  @Post('approveInternship/:id')
  @ApiOperation({ summary: 'Approve internship' })
  @ApiResponse({ status: 200, description: 'Internship approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveInternship(@Param('id') id: string): Promise<any> {
    return this.mentorService.approveInternship(id);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Project by id' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProjectById(@Param('id') id: string): Promise<any> {
    return this.mentorService.getProjectById(id);
  }

  @Get('internships/:id')
  @ApiOperation({ summary: 'Get internship by id' })
  @ApiResponse({ status: 200, description: 'Internship by id' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getInternshipById(@Param('id') id: string): Promise<any> {
    return this.mentorService.getInternshipById(id);
  }

  @Post('createAssignment')
  @ApiOperation({ summary: 'Create assignment' })
  @ApiResponse({ status: 200, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createAssignment(@Body() assignmentDto: AssignmentDto): Promise<any> {
    return this.mentorService.createAssignment(assignmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignments')
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAssignments(@Request() req: any): Promise<any> {
    return this.mentorService.getAllAssignments(req.user.userId);
  }

  @Get('submittedAssignments')
  @ApiOperation({ summary: 'Get all submitted assignments' })
  @ApiResponse({ status: 200, description: 'List of submitted assignments' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSubmittedAssignments(): Promise<any> {
    return this.mentorService.getSubmittedAssignments();
  }
}
