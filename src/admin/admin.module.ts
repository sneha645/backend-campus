import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
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
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService, TypeOrmModule],
})
export class AdminModule {}
