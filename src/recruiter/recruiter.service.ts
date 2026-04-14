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
  ) {}

  async findAll() {
    return this.userRepo.find({ where: { role: 'recruiter' } });
  }

  async createProfile(
    userId: string,
    dto: CreateCompanyProfileDto,
    logo: Express.Multer.File,
  ) {
    console.log('running');
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profile = this.companyRepo.create(dto);
    profile.user = user;
    profile.logo = logo ? `/uploads/images/${logo.filename}` : '';

    user.company = profile;
    await this.userRepo.save(user);

    const savedProfile = await this.companyRepo.save(profile);
    delete (savedProfile as any).user;

    return {
      message: 'Company profile created successfully',
      data: savedProfile,
    };
  }

  async getCompanyProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['company'],
    });
    if (!user || !user.company) {
      throw new NotFoundException('Company profile not found');
    }
    delete (user.company as any).user;
    return user.company;
  }

  async createJob(userId: string, dto: JobDto) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const job = this.jobRepo.create(dto);
    job.user = user;
    await this.jobRepo.save(job);
    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  async getMyJobs(userId: string) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['jobs'],
    });
    if (!user || !user.jobs) {
      throw new NotFoundException('Job postings not found');
    }
    return user.jobs;
  }
}
