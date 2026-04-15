import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { Company } from './company.entity';
import { Job } from './job.entity';
import { Application } from './application.entity';
import { Assignment } from './assignment.entity';
import { Internship } from './internship.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  user_id!: string;

  @Column()
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email!: string;

  @Column()
  @ApiProperty({ example: 'hashedpassword123' })
  password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'recruiter', 'student', 'mentor'],
    default: 'student',
  })
  role!: 'admin' | 'recruiter' | 'student' | 'mentor';

  @Column({ nullable: true })
  @ApiProperty({ example: '1st Year' })
  year!: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Computer Science' })
  branch!: string;

  @OneToMany(() => Project, (project) => project.student)
  studentProjects!: Project[];

  @OneToMany(() => Project, (project) => project.mentor)
  mentorProjects!: Project[];

  @OneToMany(() => Internship, (internship) => internship.student)
  studentInternship: Internship[];

  @OneToMany(() => Internship, (internship) => internship.mentor)
  mentorInternship: Internship[];

  // @OneToOne(() => Company, (company) => company.user)
  // company!: Company;

  // @OneToMany(() => Job, (job) => job.user)
  // jobs!: Job[];

  // @OneToMany(() => Application, (application) => application.student)
  // applications!: Application[];

  // @OneToMany(() => Assignment, (assignment) => assignment.student)
  // assignments!: Assignment[];

  @Column({ default: false })
  @ApiProperty({ example: false })
  isVerified!: boolean;

  @Column({ default: false })
  @ApiProperty({ example: false })
  isDeleted!: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status!: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
