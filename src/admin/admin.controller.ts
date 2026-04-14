import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending recruiters' })
  @ApiResponse({ status: 200, description: 'List of pending recruiters' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPendingRecruiters(): Promise<any> {
    return this.adminService.getPendingRecruiters();
  }

  @Post('approve/:id')
  @ApiOperation({ summary: 'Approve recruiter' })
  @ApiResponse({ status: 200, description: 'Recruiter approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveRecruiter(@Param('id') id: string): Promise<any> {
    return this.adminService.approveRecruiter(id);
  }

  @Post('reject/:id')
  @ApiOperation({ summary: 'Reject recruiter' })
  @ApiResponse({ status: 200, description: 'Recruiter reject successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectRecruiter(@Param('id') id: string): Promise<any> {
    return this.adminService.rejectRecruiter(id);
  }

  @Post('approve-student/:id')
  @ApiOperation({ summary: 'Approve student' })
  @ApiResponse({ status: 200, description: 'Student approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveStudent(@Param('id') id: string): Promise<any> {
    return this.adminService.approveStudent(id);
  }

  @Post('reject-student/:id')
  @ApiOperation({ summary: 'Reject student' })
  @ApiResponse({ status: 200, description: 'Student reject successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectStudent(@Param('id') id: string): Promise<any> {
    return this.adminService.rejectStudent(id);
  }
}
