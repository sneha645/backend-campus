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

@Entity('internship')
export class Internship {
  @PrimaryGeneratedColumn('uuid')
  internship_id!: string;

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
  certificateUrl!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status!: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => User, (user) => user.studentInternship)
  student: User;

  @ManyToOne(() => User, (user) => user.mentorInternship)
  mentor: User;

  @Column({ nullable: true })
  feedback!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
