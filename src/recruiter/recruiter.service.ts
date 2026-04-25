import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { CreateCompanyProfileDto } from 'src/dtos/company.dto';
import { Company } from 'src/entities/company.entity';
import { JobDto } from 'src/dtos/job.dto';
import { Job } from 'src/entities/job.entity';
import { Application } from 'src/entities/application.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    private readonly mailService: MailService,
  ) {}

  async findAll() {
    return this.userRepo.find({ where: { role: UserRole.RECRUITER } });
  }

  async createProfile(
    userId: string,
    dto: CreateCompanyProfileDto,
    companyLogo: Express.Multer.File,
  ) {
    const existingCompany = await this.companyRepo.findOne({
      where: { user: { user_id: userId } },
    });

    if (existingCompany) {
      throw new BadRequestException('You already created a company');
    }

    const user = await this.userRepo.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = this.companyRepo.create({
      ...dto,
      user: user,
      logoUrl: companyLogo ? `/uploads/images/${companyLogo.filename}` : '',
    });

    const savedProfile = await this.companyRepo.save(profile);

    return {
      message: 'Company profile created successfully',
      data: savedProfile,
    };
  }

  async getCompanyProfile(userId: string) {
    const company = await this.companyRepo.findOne({
      where: { user: { user_id: userId } },
    });
    if (!company) {
      throw new NotFoundException('Company profile not found');
    }
    return company;
  }

  async createJob(companyId: string, dto: JobDto) {
    const company = await this.companyRepo.findOne({
      where: { company_id: companyId },
    });
    if (!company) {
      throw new NotFoundException('User not found');
    }

    const job = this.jobRepo.create(dto);
    job.company = company;
    await this.jobRepo.save(job);
    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  async getMyJobs(userId: string) {
    const company = await this.companyRepo.findOne({
      where: { user: { user_id: userId } },
      relations: ['jobs'],
    });
    if (!company || !company.jobs) {
      throw new NotFoundException('Job postings not found');
    }
    return company.jobs;
  }

  async getApplications(jobId: string) {
    return this.applicationRepo.find({
      where: { job: { job_id: jobId } },
      relations: ['student', 'job'],
    });
  }

  async applicantShortlisted(appId: string) {
    const application = await this.applicationRepo.findOne({
      where: { application_id: appId },
      relations: ['student', 'job'],
    });
    
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    application.status = 'shortlisted';
    const updatedApplication = await this.applicationRepo.save(application);
    console.log(updatedApplication);
    await this.mailService.sendJobShortlistedEmail(
      updatedApplication.student.email,
      updatedApplication.student.name,
      updatedApplication.job.title,
      updatedApplication.job.company.companyName,
    );
    return {
      message: 'Application status updated successfully',
      data: updatedApplication,
    };
  }

  async applicantRejected(appId: string) {
    const application = await this.applicationRepo.findOne({
      where: { application_id: appId },
      relations: ['student', 'job'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    application.status = 'rejected';
    const updatedApplication = await this.applicationRepo.save(application);
    await this.mailService.sendJobRejectionEmail(
      updatedApplication.student.email,
      updatedApplication.student.name,
      updatedApplication.job.title,
      updatedApplication.job.company.companyName,
    );
    return {
      message: 'Application status updated successfully',
      data: updatedApplication,
    };
  }
}
