import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from 'src/dtos/student.dto';

import { CreateRecruiterDto } from 'src/dtos/recruiter.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { CreateMentorDto } from 'src/dtos/mentor.dto';
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

  // create admin
  async createAdmin(createAdminDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const { name, email, password } = createAdminDto;

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true,
        status: 'approved',
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
        message: 'Admin registered successfully, Please verify your email',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // create student
  async createStudent(createStudentDto: CreateStudentDto): Promise<any> {
    try {
      const { name, email, password, role, year, branch } = createStudentDto;

      const existingUser = await this.findByEmail(email);

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        year,
        branch,
      });

      const token = this.jwtService.sign({
        email: user.email,
        role: user.role,
      });

      await this.userRepo.save(user);

      const adminMail = this.configService.get<string>('ADMIN_EMAIL')!;

      await this.mailService.sendVerificationEmail(user.email, token);
      await this.mailService.sendStudentApprovalRequest(adminMail, user.email);

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

  async createMentor(createMentorDto: CreateMentorDto): Promise<any> {
    try {
      const {
        name,
        email,
        password,
        role,
        department,
        specialization,
        experience,
      } = createMentorDto;

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        department,
        specialization,
        experience,
      });

      const token = this.jwtService.sign({
        email: user.email,
        role: user.role,
      });

      await this.userRepo.save(user);

      const adminMail = this.configService.get<string>('ADMIN_EMAIL')!;

      await this.mailService.sendVerificationEmail(user.email, token);
      await this.mailService.sendMentorApprovalRequest(adminMail, user.email);

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

  // create recruiter
  async createRecruiter(createRecruiterDto: CreateRecruiterDto): Promise<any> {
    try {
      const { name, email, password, role } = createRecruiterDto;

      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
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
      const decoded = this.jwtService.verify(token);

      const user = await this.findByEmail(decoded.email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isVerified) {
        return { message: 'User already verified' };
      }

      user.isVerified = true;

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

      if (user?.status === 'rejected') {
        throw new BadRequestException(
          'User rejected, Please contact admin for more information',
        );
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
      const user = await this.userRepo.findOne({
        where: { user_id: userId },
        relations: ['company', 'studentProjects', 'mentorProjects', 'jobs'],
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
