import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  assignment_id: string;

  @Column()
  assignment_title: string;

  @Column()
  assignment_description: string;

  @Column()
  assignment_assignto: string;

  @Column()
  assignment_deadline: string;

  @Column()
  submissiontype: string;

  @ManyToOne(() => User, (user) => user.assignments)
  mentor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
