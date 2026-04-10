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
import { CreateStudentDto } from 'src/common/student.dto';
import { CreateFacultyDto } from 'src/common/faculty.dto';
import { CreateRecruiterDto } from 'src/common/recruiter.dto';
import { AuthDto } from 'src/common/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<any> {
    try {
      const { name, email, password, role } = createFacultyDto;
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
      return user;
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
      return user;
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
      console.log("Login Start")

      const user = await this.findByEmail(email);

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
        sub: user.id,
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
}
