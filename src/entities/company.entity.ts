import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  company_id!: string;

  @Column()
  @ApiProperty({ example: 'John Doe' })
  companyName!: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe@gmail.com' })
  companyEmail!: string;

  @Column()
  @ApiProperty({ example: 'Google' })
  companyDescription!: string;

  @Column()
  @ApiProperty({ example: 'https://google.com' })
  website!: string;

  @Column()
  @ApiProperty({ example: 'https://google.com' })
  logo!: string;

  @Column()
  @ApiProperty({ example: 'https://google.com' })
  location!: string;

  @OneToOne(() => User, (user) => user.company)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
