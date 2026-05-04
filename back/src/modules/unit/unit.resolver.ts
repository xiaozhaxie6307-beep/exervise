import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GetUnitsPagedInput } from './dto/get-units-paged.input';
import { SubmitUnitInput } from './dto/submit-unit.input';
import { Unit } from './models/unit.model';
import { UnitService } from './unit.service';

@Resolver(() => Unit)
export class UnitResolver {
  constructor(private unitService: UnitService) {}

  @Query(() => [Unit])
  async getUnitsPaged(
    @Args('data') data: GetUnitsPagedInput
  ): Promise<Unit[]> {
    return this.unitService.getUnitsPaged(data);
  }

  @Query(() => Int)
  async getUnitsTotal(
    @Args('data') data: GetUnitsPagedInput
  ): Promise<number> {
    return this.unitService.getUnitsTotal(data);
  }

  @Query(() => Unit, { nullable: true })
  async getUnitDetail(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Unit | null> {
    return this.unitService.getUnitDetail(id);
  }

  @Query(() => [Unit])
  async getAllUnits(): Promise<Unit[]> {
    return this.unitService.getAllUnits();
  }

  @Mutation(() => Unit)
  async submitUnit(@Args('data') data: SubmitUnitInput): Promise<Unit> {
    return this.unitService.submitUnit(data);
  }

  @Mutation(() => Unit)
  async deleteUnit(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Unit> {
    return this.unitService.deleteUnit(id);
  }
}
