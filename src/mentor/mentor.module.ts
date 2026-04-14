import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship } from 'src/entities/internship.entity';
import { Assignment } from 'src/entities/assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Internship, User, Assignment]),
    MailModule,
    AuthModule,
  ],
  providers: [MentorService],
  controllers: [MentorController],
  exports: [MentorService, TypeOrmModule],
})
export class MentorModule {}
