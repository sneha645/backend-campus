import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum ProjectStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  project_id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({ nullable: true })
  technologies!: string;

  @Column({ nullable: true })
  projectUrl!: string;

  @Column({ nullable: true })
  githubUrl!: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @ManyToOne(() => User, (user) => user.studentProjects)
  student!: User;

  @ManyToOne(() => User, (user) => user.mentorProjects)
  mentor!: User;

  @Column({ nullable: true })
  feedback!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  imageUrl!: string;
}
