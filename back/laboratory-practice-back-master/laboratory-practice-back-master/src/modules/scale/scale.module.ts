import { Module } from '@nestjs/common';

import { ScaleResolver } from './scale.resolver';
import { ScaleService } from './scale.service';

@Module({
  imports: [],
  providers: [ScaleResolver, ScaleService],
})
export class ScaleModule {}
