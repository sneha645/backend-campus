import { Module } from '@nestjs/common';
import { SetupService } from './seed.service';
import { UserModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule],
  providers: [SetupService],
})
export class SetupModule {}
