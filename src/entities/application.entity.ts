import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  application_id!: string;

  @ManyToOne(() => User, (user) => user.applications)
  student!: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job!: Job;

  @Column({
    type: 'enum',
    enum: ['applied', 'shortlisted', 'rejected'],
    default: 'applied',
  })
  status!: string;
}
