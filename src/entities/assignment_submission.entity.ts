import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';

@Entity()
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  submission_id: string;

  @ManyToOne(() => Assignment)
  assignment: Assignment;

  @ManyToOne(() => User)
  student: User;

  @Column()
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  feedback: string;

  @CreateDateColumn()
  submittedAt: Date;
}
