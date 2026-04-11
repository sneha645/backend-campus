import {
  Body,
  Controller,
  Get,
  Post,
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

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('uploadProject')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ summary: 'Upload a new project' })
  @ApiResponse({ status: 201, description: 'Project uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadProject(
    @UploadedFile() image: Express.Multer.File,
    @Body() uploadProjectDto: UploadProjectDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadProject(
      uploadProjectDto,
      image,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadInternship')
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
}
