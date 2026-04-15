import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  assignment_id: string;

  // @ManyToOne(() => User, (user) => user.assignments)
  // student: User;

  // @ManyToOne(() => User, (user) => user.assignments)
  // mentor: User;

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

  @Column()
  file: string;

  @Column()
  status: string;

  @Column()
  marks: string;

  @Column()
  feedback: string;

  @Column()
  submitted_at: string;

  @Column()
  evaluated_at: string;
}
