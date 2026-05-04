import { Module } from '@nestjs/common';

import { ScaleTypeResolver } from './scale-type.resolver';
import { ScaleTypeService } from './scale-type.service';

@Module({
  imports: [],
  providers: [ScaleTypeResolver, ScaleTypeService],
})
export class ScaleTypeModule {}
