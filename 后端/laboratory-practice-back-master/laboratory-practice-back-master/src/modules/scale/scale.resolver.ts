import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

import { ScaleReturnType } from '../scale-type/dto/scaleType-returnType';
import { GetBaseInformationTableData } from './dto/get-base-information-table-data';
import {
  QueryScaleIdByNameInput,
  QueryScaleIdByNameReturnType,
} from './dto/query-scaleId-byName.input';
import { SubmitBaseInformation } from './dto/submit-scale-information';
import { Scale } from './models/scale.model';
import { ScaleService } from './scale.service';

@Resolver(() => Scale)
export class ScaleResolver {
  constructor(
    private scaleService: ScaleService,
    private prisma: PrismaService
  ) {}

  @Query(() => [Scale])
  async getBaseInformationTableData(
    @Args('data') queryData: GetBaseInformationTableData
  ): Promise<Scale[]> {
    const result = await this.scaleService.getBaseInformationTableData(
      queryData
    );
    return result;
  }

  // @UseGuards(GqlAuthGuard)
  @Query(() => Number)
  async totalCount(
    @Args('data') queryData: GetBaseInformationTableData
  ): Promise<number> {
    const result = await this.scaleService.totalCount(queryData);
    return result;
  }

  @Query(() => Scale)
  async getScaleDetail(@Args('data') data: number): Promise<Scale> {
    const result = await this.scaleService.getScaleDetail(data);
    return result;
  }

  @Mutation(() => Scale)
  async submitBaseInformation(
    @Args('data') data: SubmitBaseInformation
  ): Promise<Scale> {
    return this.scaleService.submitBaseInformation(data);
  }

  // 根据量表id获取name
  @Query(() => QueryScaleIdByNameReturnType)
  async getScaleIdByName(
    @Args('data') queryScaleIdByNameInput: QueryScaleIdByNameInput
  ): Promise<QueryScaleIdByNameReturnType> {
    return this.scaleService.getScaleIdByName(queryScaleIdByNameInput);
  }
  // 根据类型获取量表
  @Query(() => ScaleReturnType)
  async getScaleByType(
    @Args('scaleTypeId') scaleTypeId: number
  ): Promise<ScaleReturnType> {
    return this.scaleService.getScaleByType(scaleTypeId);
  }

  // 查找所有scale数据
  @Query(() => [Scale])
  async scales(): Promise<Scale[] | null> {
    return this.scaleService.findScales();
  }
}
