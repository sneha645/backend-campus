import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from 'src/dtos/student.dto';
import { CreateRecruiterDto } from 'src/dtos/recruiter.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { AuthService } from './auth.service';
import { createMentorDto } from 'src/dtos/mentor.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-student')
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

  @Post('register-mentor')
  @ApiOperation({ summary: 'Register a new mentor' })
  @ApiResponse({ status: 201, description: 'Mentor registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Mentor already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registerMentor(
    @Body() createMentorDto: createMentorDto,
    @Request() req: any,
  ): Promise<any> {
    return this.authService.createMentor(createMentorDto);
  }

  @Post('register-recruiter')
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
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const data = await this.authService.login(authDto);
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      data,
    };
  }

  @Get('verifyEmail')
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async verifyEmail(@Query('token') token: string): Promise<any> {
    return this.authService.verifyEmail(token);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async me(@Request() req: any): Promise<any> {
    return this.authService.me(req.user.userId);
  }
}
