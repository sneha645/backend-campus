import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { UploadProjectDto } from 'src/dtos/project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UploadInternshipDto } from 'src/dtos/internship.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/upload.config';
import { UpdateStudentProfileDto } from 'src/dtos/updateStudentProfile.dto';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // upload project
  @UseGuards(JwtAuthGuard)
  @Post('project')
  @UseInterceptors(FileInterceptor('projectImage', multerConfig))
  @ApiOperation({ summary: 'Upload a new project' })
  @ApiResponse({ status: 201, description: 'Project uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadProject(
    @UploadedFile() projectImage: Express.Multer.File,
    @Body() uploadProjectDto: UploadProjectDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadProject(
      uploadProjectDto,
      projectImage,
      req.user.userId,
    );
  }

  // upload internship
  @UseGuards(JwtAuthGuard)
  @Post('internship')
  @UseInterceptors(FileInterceptor('certificateImage', multerConfig))
  @ApiOperation({ summary: 'Upload a new internship' })
  @ApiResponse({ status: 201, description: 'Internship uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadInternship(
    @UploadedFile() certificateImage: Express.Multer.File,
    @Body() uploadInternshipDto: UploadInternshipDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadInternship(
      uploadInternshipDto,
      certificateImage,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyProjects')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 201, description: 'Projects fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMyProjects(@Request() req: any): Promise<any> {
    return this.studentService.getMyProjects(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyInternships')
  @ApiOperation({ summary: 'Get all internships' })
  @ApiResponse({ status: 201, description: 'Internships fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMyInternships(@Request() req: any): Promise<any> {
    return this.studentService.getMyInternships(req.user.userId);
  }

  //job features
  @UseGuards(JwtAuthGuard)
  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 201, description: 'Jobs fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getJobs(): Promise<any> {
    return this.studentService.getJobs();
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply/:jobId')
  @UseInterceptors(FileInterceptor('resume', multerConfig))
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 201, description: 'Job applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async applyForJob(
    @Param('jobId') jobId: string,
    @UploadedFile() resume: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.applyJob(jobId, resume, req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('getProfile')
  // @ApiOperation({ summary: 'Get profile' })
  // @ApiResponse({ status: 201, description: 'Profile fetched successfully' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getProfile(@Request() req: any): Promise<any> {
  //   return this.studentService.getProfile(req.user.userId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put('updateProfile')
  // @ApiOperation({ summary: 'Update profile' })
  // @ApiResponse({ status: 201, description: 'Profile updated successfully' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async updateProfile(
  //   @Body() updateProfileDto: UpdateStudentProfileDto,
  //   @Request() req: any,
  // ): Promise<any> {
  //   return this.studentService.updateProfile(updateProfileDto, req.user.userId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('assignments')
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAssignments(@Request() req: any): Promise<any> {
    return this.studentService.getAllAssignments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submitAssignment/:assignmentId')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Submit an assignment' })
  @ApiResponse({
    status: 201,
    description: 'Assignment submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async submitAssignment(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ): Promise<any> {
    return this.studentService.submitAssignment(file, req.user.userId, assignmentId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('submitAssignment')
  // @UseInterceptors(FileInterceptor('file', multerConfig))
  // @ApiOperation({ summary: 'Submit an assignment' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Assignment submitted successfully',
  // })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async submitAssignment(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req: any,
  // ): Promise<any> {
  //   return this.studentService.submitAssignment(file, req.user.userId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('all')
  // @ApiOperation({ summary: 'Get all students' })
  // @ApiResponse({ status: 200, description: 'List of students' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getAllStudents(): Promise<any> {
  //   return this.studentService.getAllStudents();
  // }

  // @Get('jobs')
  // @ApiOperation({ summary: 'Get all jobs' })
  // @ApiResponse({ status: 200, description: 'List of jobs' })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getAllJobs(): Promise<any> {
  //   return this.studentService.getAllJobs();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('getMyApplications')
  // @ApiOperation({ summary: 'Get all applications' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Applications fetched successfully',
  // })
  // @ApiResponse({ status: 400, description: 'Invalid request' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async getMyApplications(@Request() req: any): Promise<any> {
  //   return this.studentService.getMyApplications(req.user.userId);
  // }
}
