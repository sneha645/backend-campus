import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly mailService: MailService,
  ) { }

  async getAllStudents() {
    return this.userRepo.find({
      where: { role: UserRole.STUDENT },
    });
  }

  async getAllMentors() {
    return this.userRepo.find({
      where: { role: UserRole.MENTOR },
    });
  }

  async getAllRecruiters() {
    return this.userRepo.find({
      where: { role: UserRole.RECRUITER },
    });
  }

  async approve(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'approved';
    await this.userRepo.save(user);
    this.mailService.sendUserApprovalEmail(user.email, user.name);
    return { message: 'Approved successfully' };
  }

  async reject(id: string) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
      throw new Error('User not found');
    }
    user.status = 'rejected';
    await this.userRepo.save(user);
    this.mailService.sendUserRejectionEmail(user.email, user.name);
    return { message: ' rejected successfully' };
  }

  // async getPendingRecruiters() {
  //   return this.userRepo.find({
  //     where: { role: UserRole.RECRUITER, status: 'pending' },
  //   });
  // }

  // async approveStudent(id: string) {
  //   const user = await this.userRepo.findOne({ where: { user_id: id } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   user.status = 'approved';
  //   await this.userRepo.save(user);
  //   return { message: 'Student approved successfully' };
  // }

  // async rejectStudent(id: string) {
  //   const user = await this.userRepo.findOne({ where: { user_id: id } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   user.status = 'rejected';
  //   await this.userRepo.save(user);
  //   return { message: 'Student reject successfully' };
  // }
}
