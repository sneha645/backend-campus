import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [UserModule],
    providers: [SetupService],
})
export class SetupModule { }