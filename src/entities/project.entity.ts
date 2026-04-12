import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ProjectStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
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
  status!: ProjectStatus;

  @ManyToOne(() => User, (user) => user.mentorProjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor!: User;

  @ManyToOne(() => User, (user) => user.studentProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  imageUrl!: string;
}
