import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { UploadInternshipDto } from 'src/dtos/internship.dto';
import { Internship } from 'src/entities/internship.entity';
import { CreateCompanyProfileDto } from 'src/dtos/company.dto';
import { Company } from 'src/entities/company.entity';

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
    return this.companyRepo.save(profile);
  }
}
