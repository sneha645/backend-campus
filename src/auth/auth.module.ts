import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './auth.service';
import { UserController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
    MailModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, JwtModule],
})
export class UserModule {}
