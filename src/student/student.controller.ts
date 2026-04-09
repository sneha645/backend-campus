import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { UploadProjectDto } from 'src/common/uploadProject.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  
  @UseGuards(JwtAuthGuard)
  @Post('uploadProject')
  @ApiOperation({ summary: 'Upload a new project' })
  @ApiResponse({ status: 201, description: 'Project uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Project already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadProject(
    @Body() uploadProjectDto: UploadProjectDto,
    @Request() req: any,
  ): Promise<any> {
    console.log('req', req.user.sub);
    return this.studentService.uploadProject(uploadProjectDto, req.user.sub);
  }
}
