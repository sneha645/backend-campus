import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecruiterService } from './recruiter.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCompanyProfileDto } from 'src/dtos/company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/upload.config';
import { JobDto } from 'src/dtos/job.dto';

@ApiTags('Recruiter')
@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiOperation({ summary: 'Get all recruiters' })
  @ApiResponse({ status: 201, description: 'Recruiters fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    return this.recruiterService.findAll();
  }

  //create company profile
  @UseGuards(JwtAuthGuard)
  @Post('createCompanyProfile')
  @UseInterceptors(FileInterceptor('companyLogo', multerConfig))
  @ApiOperation({ summary: 'Create recruiter company profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createProfile(
    @Body() createCompanyProfileDto: CreateCompanyProfileDto,
    @UploadedFile() companyLogo: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.recruiterService.createProfile(
      userId,
      createCompanyProfileDto,
      companyLogo,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getCompanyProfile')
  @ApiOperation({ summary: 'Get company profile' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCompanyProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.recruiterService.getCompanyProfile(userId);
  }

  //create job
  @UseGuards(JwtAuthGuard)
  @Post('createJob/:companyId')
  @ApiOperation({ summary: 'Create job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createJob(
    @Body() jobDto: JobDto,
    @Param('companyId') companyId: string,
    @Req() req: any,
  ) {
    return this.recruiterService.createJob(companyId, jobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyJobs')
  @ApiOperation({ summary: 'Get my jobs' })
  @ApiResponse({
    status: 200,
    description: 'My jobs fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Job postings not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMyJobs(@Req() req: any) {
    const userId = req.user.userId;
    return this.recruiterService.getMyJobs(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyApplications/:jobId')
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({
    status: 200,
    description: 'Applications fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Applications not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getApplications(@Req() req: any, @Param('jobId') jobId: string) {
    return this.recruiterService.getApplications(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('applicanttShortlisted/:appId')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async applicantShortlisted(@Param('appId') appId: string, @Req() req: any) {
    return this.recruiterService.applicantShortlisted(appId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('applicantRejected/:appId')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async applicantRejected(@Param() appId: string, @Req() req: any) {
    return this.recruiterService.applicantRejected(appId);
  }
}
