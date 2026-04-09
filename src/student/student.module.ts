import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Project } from './entities/Project.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Project]),
    MailModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService, JwtModule, TypeOrmModule],
})
export class StudentModule {}
