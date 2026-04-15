import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { UploadInternshipDto } from 'src/dtos/internship.dto';
import { Internship } from 'src/entities/internship.entity';
import { CreateCompanyProfileDto } from 'src/dtos/company.dto';
import { Company } from 'src/entities/company.entity';
import { JobDto } from 'src/dtos/job.dto';
import { Job } from 'src/entities/job.entity';
import { Application } from 'src/entities/application.entity';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  async findAll() {
    return this.userRepo.find({ where: { role: 'recruiter' } });
  }

  async createProfile(
    userId: string,
    dto: CreateCompanyProfileDto,
    logo: Express.Multer.File,
  ) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = this.companyRepo.create(dto);
    console.log('profile', profile);
    // profile.user = user;
    profile.logoUrl = logo ? `/uploads/images/${logo.filename}` : '';

    // user.company = profile;
    console.log('user', user);
    await this.userRepo.save(user);

    const savedProfile = await this.companyRepo.save(profile);
    delete (savedProfile as any).user;

    return {
      message: 'Company profile created successfully',
      data: savedProfile,
    };

    // return {
    //   message: 'Company profile created successfully',
    //   data: savedProfile,
    // };
  }

  async getCompanyProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['company'],
    });
    // if (!user || !user.company) {
    //   throw new NotFoundException('Company profile not found');
    // }
    // delete (user.company as any).user;
    // return user.company;
  }

  async createJob(userId: string, dto: JobDto) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const job = this.jobRepo.create(dto);
    // job.user = user;
    // await this.jobRepo.save(job);
    // return {
    //   message: 'Job created successfully',
    //   data: job,
    // };
  }

  async getMyJobs(userId: string) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['jobs'],
    });
    // if (!user || !user.jobs) {
    //   throw new NotFoundException('Job postings not found');
    // }
    // return user.jobs;
  }

  async getApplications(jobId: string) {
    return this.applicationRepo.find({
      where: { job: { job_id: jobId } },
      relations: ['student', 'job'],
    });
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    const application = await this.applicationRepo.findOne({
      where: { application_id: applicationId },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    application.status = status;
    await this.applicationRepo.save(application);
    return {
      message: 'Application status updated successfully',
      data: application,
    };
  }
}
