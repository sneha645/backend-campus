import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

import { AuthModule } from 'src/auth/auth.module';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship } from 'src/entities/internship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Internship, User]),
    MailModule,
    AuthModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService, TypeOrmModule],
})
export class StudentModule {}
