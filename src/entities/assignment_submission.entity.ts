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

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  assignment: Assignment;

  @ManyToOne(() => User)
  student: User;

  @Column()
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted',
  })
  status: 'submitted' | 'approved' | 'rejected';

  @Column({ nullable: true })
  feedback: string;

  @Column({ nullable: true })
  score: number;

  @ManyToOne(() => User)
  mentor: User;

  @CreateDateColumn()
  submittedAt: Date;
}
