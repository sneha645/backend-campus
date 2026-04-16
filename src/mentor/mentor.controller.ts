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

  @UseGuards(JwtAuthGuard)
  @Get('internships')
  @ApiOperation({ summary: 'Get all internships' })
  @ApiResponse({ status: 200, description: 'List of internships' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllInternships(@Request() req: any): Promise<any> {
    return this.mentorService.getAllInternships(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assigned-projects')
  @ApiOperation({ summary: 'Get assigned projects' })
  @ApiResponse({ status: 200, description: 'List of assigned projects' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAssignedProjects(@Request() req: any): Promise<any> {
    return this.mentorService.getAssignedProjects(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('approveProject/:id')
  @ApiOperation({ summary: 'Approve project' })
  @ApiResponse({ status: 200, description: 'Project approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveProject(
    @Param('id') id: string,
    @Body() dto: { status: 'approved'; feedback: string },
  ): Promise<any> {
    return this.mentorService.approveProject(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rejectProject/:id')
  @ApiOperation({ summary: 'Reject project' })
  @ApiResponse({ status: 200, description: 'Project rejected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectProject(
    @Param('id') id: string,
    @Body() dto: { status: 'rejected'; feedback: string },
  ): Promise<any> {
    return this.mentorService.rejectProject(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('approveInternship/:id')
  @ApiOperation({ summary: 'Approve internship' })
  @ApiResponse({ status: 200, description: 'Internship approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveInternship(
    @Param('id') id: string,
    @Body() dto: { status: 'approved'; feedback: string },
  ): Promise<any> {
    return this.mentorService.approveInternship(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rejectInternship/:id')
  @ApiOperation({ summary: 'Reject project' })
  @ApiResponse({ status: 200, description: 'Project rejected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectInternship(
    @Param('id') id: string,
    @Body() dto: { status: 'rejected'; feedback: string },
  ): Promise<any> {
    return this.mentorService.rejectProject(id, dto);
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

  @UseGuards(JwtAuthGuard)
  @Post('assignment')
  @ApiOperation({ summary: 'Create assignment' })
  @ApiResponse({ status: 200, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createAssignment(
    @Body() assignmentDto: AssignmentDto,
    @Request() req: any,
  ): Promise<any> {
    return this.mentorService.createAssignment(assignmentDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-assignments')
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAssignments(@Request() req: any): Promise<any> {
    return this.mentorService.getAllAssignments(req.user.userId);
  }

  @Get('submitted-assignments/:id')
  @ApiOperation({ summary: 'Get all submitted assignments' })
  @ApiResponse({ status: 200, description: 'List of submitted assignments' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSubmittedAssignments(@Param('id') id: string): Promise<any> {
    return this.mentorService.getSubmittedAssignments(id);
  }

  @Post('approve-assignment/:id')
  @ApiOperation({ summary: 'Approve submitted assignment' })
  @ApiResponse({
    status: 200,
    description: 'Submitted assignment approved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveSubmittedAssignment(@Param('id') id: string): Promise<any> {
    return this.mentorService.approveSubmittedAssignment(id);
  }

  @Post('reject-assignment/:id')
  @ApiOperation({ summary: 'Reject submitted assignment' })
  @ApiResponse({
    status: 200,
    description: 'Submitted assignment rejected successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectSubmittedAssignment(@Param('id') id: string): Promise<any> {
    return this.mentorService.rejectSubmittedAssignment(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('assignments')
  // @ApiOperation({ summary: 'Get all assignments' })
  // @ApiResponse({ status: 200, description: 'List of assignments' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getAllAssignments(@Request() req: any): Promise<any> {
  //   return this.mentorService.getAllAssignments(req.user.userId);
  // }

  // @Get('submittedAssignments')
  // @ApiOperation({ summary: 'Get all submitted assignments' })
  // @ApiResponse({ status: 200, description: 'List of submitted assignments' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getSubmittedAssignments(): Promise<any> {
  //   return this.mentorService.getSubmittedAssignments();
  // }
}
