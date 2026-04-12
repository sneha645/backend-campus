import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship } from 'src/entities/internship.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async approveRecruiter(id: string) {
    console.log('approved service run');
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    console.log('user', user);
    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'approved';
    await this.userRepo.save(user);
    return { message: 'Recruiter approved successfully' };
  }

  async rejectRecruiter(id: string) {
    console.log('reject service run');
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    console.log('user', user);
    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'rejected';
    await this.userRepo.save(user);
    return { message: 'Recruiter reject successfully' };
  }

  async getPendingRecruiters() {
    return this.userRepo.find({
      where: { role: 'recruiter', status: 'pending' },
    });
  }
}
