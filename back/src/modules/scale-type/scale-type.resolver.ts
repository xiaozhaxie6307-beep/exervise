import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

import { getScaleTypeInformationToWeightlessnessReduction } from './dto/get-scale-information';
import {
  getScaleTypeTableData,
  ScaleTypeReturnType,
  SubmitScaleTypeInformation,
} from './dto/scaleType-returnType';
import { ScaleType } from './models/scale-type.models';
import { ScaleTypeService } from './scale-type.service';

@Resolver(() => ScaleType)
export class ScaleTypeResolver {
  constructor(
    private scaleTypeService: ScaleTypeService,
    private prisma: PrismaService
  ) {}
  @Query(() => [ScaleType])
  async scaleTypes(): Promise<ScaleType[]> {
    return this.scaleTypeService.findScaleTypes();
  }

  @Query(() => [ScaleType])
  async getScaleTypes(): Promise<ScaleType[]> {
    const result = await this.scaleTypeService.getScaleTypes();
    return result;
  }
  @Query(() => ScaleTypeReturnType)
  async getAllScaleTypeAndName(): Promise<ScaleTypeReturnType> {
    return await this.scaleTypeService.getAllScaleTypeAndName();
  }

  @Query(() => [ScaleType])
  async getScaleTypeTableData(
    @Args('data') queryData: getScaleTypeTableData
  ): Promise<ScaleType[]> {
    const result = await this.scaleTypeService.getScaleTypeTableData(queryData);
    return result;
  }

  @Query(() => Number)
  async scaleTotalCount(
    @Args('data') queryData: getScaleTypeTableData
  ): Promise<number> {
    const result = await this.scaleTypeService.scaleTotalCount(queryData);
    return result;
  }

  @Query(() => ScaleType)
  async getScaleTypeDetail(@Args('data') data: number): Promise<ScaleType> {
    const result = await this.scaleTypeService.getScaleTypeDetail(data);
    return result;
  }

  @Mutation(() => ScaleType)
  async submitScaleTypeInformation(
    @Args('data') data: SubmitScaleTypeInformation
  ): Promise<ScaleType | undefined> {
    return this.scaleTypeService.submitScaleTypeInformation(data);
  }

  // 查询量表名称和编号用于去重
  @Query(() => getScaleTypeInformationToWeightlessnessReduction)
  async getScaleTypeInformationToWeightlessnessReduction(): Promise<getScaleTypeInformationToWeightlessnessReduction> {
    return await this.scaleTypeService.getScaleTypeInformationToWeightlessnessReduction();
  }
}
