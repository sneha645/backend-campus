import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { UploadProjectDto } from 'src/dtos/project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UploadInternshipDto } from 'src/dtos/internship.dto';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('uploadProject')
  @ApiOperation({ summary: 'Upload a new project' })
  @ApiResponse({ status: 201, description: 'Project uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadProject(
    @Body() uploadProjectDto: UploadProjectDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadProject(uploadProjectDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadInternship')
  @ApiOperation({ summary: 'Upload a new internship' })
  @ApiResponse({ status: 201, description: 'Internship uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadInternship(
    @Body() uploadInternshipDto: UploadInternshipDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadInternship(uploadInternshipDto, req.user.userId);
  }
}
