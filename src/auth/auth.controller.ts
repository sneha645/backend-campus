import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from 'src/dtos/student.dto';
import { CreateFacultyDto } from 'src/dtos/faculty.dto';
import { CreateRecruiterDto } from 'src/dtos/recruiter.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registerStudent')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registerStudent(
    @Body() createStudentDto: CreateStudentDto,
    @Request() req: any,
  ): Promise<any> {
    return this.authService.createStudent(createStudentDto);
  }

  @Post('registerFaculty')
  @ApiOperation({ summary: 'Register a new faculty' })
  @ApiResponse({ status: 201, description: 'Faculty registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Faculty already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registerFaculty(
    @Body() createFacultyDto: CreateFacultyDto,
    @Request() req: any,
  ): Promise<any> {
    return this.authService.createFaculty(createFacultyDto);
  }

  @Post('registerRecruiter ')
  @ApiOperation({ summary: 'Register a new recruiter ' })
  @ApiResponse({
    status: 201,
    description: 'Recruiter  registered successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Recruiter  already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registerRequiter(
    @Body() createRecruiterDto: CreateRecruiterDto,
    @Request() req: any,
  ): Promise<any> {
    return this.authService.createRecruiter(createRecruiterDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() authDto: AuthDto): Promise<any> {
    return this.authService.login(authDto);
  }

  @Get('verifyEmail')
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async verifyEmail(@Query('token') token: string): Promise<any> {
    return this.authService.verifyEmail(token);
  }
}
