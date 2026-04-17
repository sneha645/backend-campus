import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('all-students')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'All students fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllStudents(@Req() req: any): Promise<any> {
    return this.adminService.getAllStudents();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-mentors')
  @ApiOperation({ summary: 'Get all mentors' })
  @ApiResponse({ status: 200, description: 'All mentors fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMentors(@Req() req: any): Promise<any> {
    return this.adminService.getAllMentors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-recruiters')
  @ApiOperation({ summary: 'Get all recruiters' })
  @ApiResponse({
    status: 200,
    description: 'All recruiters fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllRecruiters(@Req() req: any): Promise<any> {
    return this.adminService.getAllRecruiters();
  }

  @UseGuards(JwtAuthGuard)
  @Post('approve/:id')
  @ApiOperation({ summary: 'Approve user' })
  @ApiResponse({ status: 200, description: 'User approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveUser(@Param('id') id: string, @Req() req: any): Promise<any> {
    return this.adminService.approve(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:id')
  @ApiOperation({ summary: 'Reject user' })
  @ApiResponse({ status: 200, description: 'User reject successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectUser(@Param('id') id: string, @Req() req: any): Promise<any> {
    return this.adminService.reject(id);
  }
}
