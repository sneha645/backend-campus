import {
  Body,
  Controller,
  Get,
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

  @UseGuards(JwtAuthGuard)
  @Post('uploadCompany')
  @UseInterceptors(FileInterceptor('logo', multerConfig))
  @ApiOperation({ summary: 'Create recruiter company profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createProfile(
    @Body() createCompanyProfileDto: CreateCompanyProfileDto,
    @UploadedFile() logo: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.recruiterService.createProfile(
      userId,
      createCompanyProfileDto,
      logo,
    );
  }
}
