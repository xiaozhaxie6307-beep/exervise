import { Module } from '@nestjs/common';

import { UnitResolver } from './unit.resolver';
import { UnitService } from './unit.service';

@Module({
  imports: [],
  providers: [UnitResolver, UnitService],
  exports: [UnitService],
})
export class UnitModule {}
