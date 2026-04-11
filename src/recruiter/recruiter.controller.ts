import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecruiterService } from './recruiter.service';

@ApiTags('Recruiter')
@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}
}
