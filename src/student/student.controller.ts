import {
  Body,
  Controller,
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
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Upload a new project' })
  @ApiResponse({ status: 201, description: 'Project uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadProject(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadProjectDto: UploadProjectDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadProject(
      {
        ...uploadProjectDto,
        imageUrl: file ? `uploads/${file.filename}` : undefined,
      },
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadInternship')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Upload a new internship' })
  @ApiResponse({ status: 201, description: 'Internship uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadInternship(
    @Body() uploadInternshipDto: UploadInternshipDto,
    @Request() req: any,
  ): Promise<any> {
    return this.studentService.uploadInternship(
      uploadInternshipDto,
      req.user.userId,
    );
  }
}
