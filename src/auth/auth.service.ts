import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from 'src/dtos/student.dto';

import { CreateRecruiterDto } from 'src/dtos/recruiter.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { createMentorDto } from 'src/dtos/mentor.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async create(data: any) {
    return this.userRepo.save(data);
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<any> {
    try {
      const { name, email, password, role } = createStudentDto;

      const existingUser = await this.findByEmail(email);

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const token = this.jwtService.sign({
        email: user.email,
        role: user.role,
      });

      await this.userRepo.save(user);

      await this.mailService.sendVerificationEmail(user.email, token);

      return {
        message: 'Student registered successfully, Please verify your email',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createMentor(createMentorDto: createMentorDto): Promise<any> {
    try {
      const { name, email, password, role } = createMentorDto;
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const token = this.jwtService.sign({
        email: user.email,
        role: user.role,
      });

      await this.userRepo.save(user);

      await this.mailService.sendVerificationEmail(user.email, token);

      return {
        message: 'Mentor registered successfully, Please verify your email',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createRecruiter(createRecruiterDto: CreateRecruiterDto): Promise<any> {
    try {
      const { name, email, password, role } = createRecruiterDto;
      console.log('recruiter service run');

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const token = this.jwtService.sign({
        email: user.email,
        role: user.role,
      });

      await this.userRepo.save(user);

      const adminMail = this.configService.get<string>('ADMIN_EMAIL')!;

      await this.mailService.sendVerificationEmail(user.email, token);
      await this.mailService.sendAdminApprovalRequest(adminMail, user.email);

      return {
        message: 'Recruiter registered successfully, Please verify your email',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async verifyEmail(token: string) {
    try {
      console.log('verify email service run');
      const decoded = this.jwtService.verify(token);

      const user = await this.findByEmail(decoded.email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isVerified) {
        return { message: 'User already verified' };
      }

      user.isVerified = true;

      if (user.role === 'recruiter') {
        user.status = 'pending';
      } else {
        user.status = 'approved';
      }

      await this.userRepo.save(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      console.log('error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async login(authDto: AuthDto): Promise<any> {
    try {

      const { email, password } = authDto;

      const user = await this.findByEmail(email);

      if (user?.status === 'pending') {
        throw new BadRequestException(
          'User not approved, Please wait for approval',
        );
      }

      if (user && !user.isVerified) {
        throw new BadRequestException(
          'User not verified, Please verify your email',
        );
      }

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        email: user.email,
        sub: user.user_id,
      };

      const token = this.jwtService.sign(payload);

      return {
        message: 'Login successful',
        user,
        token,
      };
    } catch (error) {
      console.log('error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async me(userId: string): Promise<any> {
    try {
      console.log('me service run');
      const user = await this.userRepo.findOne({ where: { user_id: userId } });
      return {
        message: 'User fetched successfully',
        user,
      };
    } catch (error) {
      console.log('error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
