import { ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { CreateStudentDto } from "src/common/student.dto";
import { CreateFacultyDto } from "src/common/faculty.dto";
import { CreateRecruiterDto } from "src/common/recruiter.dto";
import { AuthDto } from "src/common/auth.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly configService: ConfigService,
    ) { }


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
            return user;
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

    async login(authDto: AuthDto): Promise<any> {
        try {
            const { email, password } = authDto;
            const user = await this.findByEmail(email);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return user;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to login');
        }
    }
}