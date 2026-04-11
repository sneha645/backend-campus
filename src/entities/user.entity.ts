import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';

@Entity()
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

  @Column({ default: false })
  @ApiProperty({ example: false })
  isVerified!: boolean;

  @Column({})
  @ApiProperty({ example: 'student' })
  role!: string;

  @Column({ default: false })
  @ApiProperty({ example: false })
  isDeleted!: boolean;

  @OneToMany(() => Project, (project) => project.student)
  studentProjects!: Project[];

  @OneToMany(() => Project, (project) => project.mentor)
  mentorProjects!: Project[];

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
