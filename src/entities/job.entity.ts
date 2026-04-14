import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('job')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  job_id!: string;

  @Column()
  @ApiProperty({ example: 'Senior Full Stack Engineer' })
  title!: string;

  @Column('text')
  @ApiProperty({
    example: 'We are looking for a talented Senior Full Stack Engineer...',
  })
  description!: string;

  @Column()
  @ApiProperty({ example: 'Remote' })
  location!: string;

  @Column()
  @ApiProperty({ example: 'Full-time' })
  jobType!: string;

  @Column()
  @ApiProperty({ example: '5+ years' })
  experience!: string;

  @Column()
  @ApiProperty({ example: '120000-150000' })
  salary!: string;

  @Column('simple-array')
  @ApiProperty({ example: ['React', 'Node.js', 'AWS'] })
  requirements!: string[];

  @Column('simple-array')
  @ApiProperty({
    example: [
      'Develop and maintain web applications',
      'Collaborate with cross-functional teams',
    ],
  })
  responsibilities!: string[];

  @Column('simple-array')
  @ApiProperty({ example: ['Health insurance', '401(k)', 'Flexible hours'] })
  benefits!: string[];

  @Column()
  @ApiProperty({ example: 'open', enum: ['open', 'closed', 'draft'] })
  status!: string;

  @ManyToOne(() => User, (user) => user.jobs)
  user!: User;

  @OneToMany(() => Application, (application) => application.job)
  applications!: Application[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
