import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('approve/:id')
  @ApiOperation({ summary: 'Approve recruiter' })
  @ApiResponse({ status: 200, description: 'Recruiter approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async approveRecruiter(@Param('id') id: string): Promise<any> {
    return this.adminService.approve(id);
  }

  @Post('reject/:id')
  @ApiOperation({ summary: 'Reject recruiter' })
  @ApiResponse({ status: 200, description: 'Recruiter reject successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async rejectRecruiter(@Param('id') id: string): Promise<any> {
    return this.adminService.reject(id);
  }
}
