import { Module } from '@nestjs/common';

import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  imports: [],
  providers: [ExperienceResolver, ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
