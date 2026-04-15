import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

import { AuthModule } from 'src/auth/auth.module';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship } from 'src/entities/internship.entity';
import { Job } from 'src/entities/job.entity';
import { Application } from 'src/entities/application.entity';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentSubmission } from 'src/entities/assignment_submission.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Internship,
      User,
      Job,
      Application,
      Assignment,
      AssignmentSubmission,
    ]),
    MailModule,
    AuthModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService, TypeOrmModule],
})
export class StudentModule {}
