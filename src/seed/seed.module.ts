import { Module } from '@nestjs/common';
import { SetupService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SetupService],
})
export class SetupModule {}
