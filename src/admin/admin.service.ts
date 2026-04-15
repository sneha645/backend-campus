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

  async approve(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'approved';
    await this.userRepo.save(user);
    return { message: 'Approved successfully' };
  }

  async reject(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'rejected';
    await this.userRepo.save(user);
    return { message: ' reject successfully' };
  }

  async getPendingRecruiters() {
    return this.userRepo.find({
      where: { role: 'recruiter', status: 'pending' },
    });
  }

  async approveStudent(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'approved';
    await this.userRepo.save(user);
    return { message: 'Student approved successfully' };
  }

  async rejectStudent(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'rejected';
    await this.userRepo.save(user);
    return { message: 'Student reject successfully' };
  }
}
