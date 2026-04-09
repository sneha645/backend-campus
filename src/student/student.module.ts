import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UploadProject } from '../entities/uploadProject';

@Module({
  imports: [TypeOrmModule.forFeature([UploadProject]), MailModule],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService, TypeOrmModule],
})
export class StudentModule {}
