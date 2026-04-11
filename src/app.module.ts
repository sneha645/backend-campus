import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SetupModule } from './seed/seed.module';
import { StudentModule } from './student/student.module';
import { Project } from './entities/project.entity';
import { Internship } from './entities/internship.entity';
import { User } from './entities/user.entity';
import { AdminModule } from './admin/admin.module';
import { MentorModule } from './mentor/mentor.module';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [Project, Internship, User],
        synchronize: true,
      }),
    }),
    AuthModule,
    SetupModule,
    StudentModule,
    RecruiterModule,
    MentorModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
