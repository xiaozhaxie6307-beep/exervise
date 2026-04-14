import { Injectable } from '@nestjs/common';
import type { Scale } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import type { ScaleReturnType } from '../scale-type/dto/scaleType-returnType';
import type { GetBaseInformationTableData } from './dto/get-base-information-table-data';
import type {
  QueryScaleIdByNameInput,
  QueryScaleIdByNameReturnType,
} from './dto/query-scaleId-byName.input';
import type { SubmitBaseInformation } from './dto/submit-scale-information';

@Injectable()
export class ScaleService {
  constructor(private prisma: PrismaService) {}

  async totalCount(queryData: GetBaseInformationTableData): Promise<number> {
    const { scaleName, scaleType } = queryData;
    const scaleWhere = {
      name: {
        contains: scaleName,
      },
      scaleTypeId: scaleType ? Number(scaleType) : undefined,
    };

    const count = await this.prisma.scale.count({
      where: { ...scaleWhere },
    });

    return count;
  }

  async getBaseInformationTableData(
    queryData: GetBaseInformationTableData
  ): Promise<Scale[]> {
    const { currentPage, pageNumber, scaleType, scaleName } = queryData;
    const scaleWhere = {
      name: {
        contains: scaleName,
      },
      scaleTypeId: scaleType ? Number(scaleType) : undefined,
    };

    try {
      const scales = await this.prisma.scale.findMany({
        where: { ...scaleWhere },
        skip: (currentPage - 1) * pageNumber,
        take: pageNumber,
      });

      return scales;
    } catch (error) {
      console.log(error);
    }
    return new Promise(() => {
      return;
    });
  }

  async getScaleDetail(id: number): Promise<Scale> {
    const scale = await this.prisma.scale.findUnique({
      where: {
        id,
      },
    });
    return scale
      ? scale
      : new Promise(() => {
          return;
        });
  }

  async submitBaseInformation(data: SubmitBaseInformation): Promise<Scale> {
    const { id, scaleTypeId, ...others } = data || {};
    if (!id) {
      return this.prisma.scale.create({
        data: {
          ...others,
          uuid: uuidv4(),
          scaleType: {
            connect: {
              id: scaleTypeId,
            },
          },
        },
      });
    }
    return this.prisma.scale.update({
      data: {
        ...others,
        scaleType: {
          connect: {
            id: scaleTypeId,
          },
        },
      },
      where: {
        id,
      },
    });
  }
  // 根据量表id获取name
  async getScaleIdByName(
    queryScaleIdByNameInput: QueryScaleIdByNameInput
  ): Promise<QueryScaleIdByNameReturnType> {
    const { scaleName, scaleTypeId } = queryScaleIdByNameInput;
    const scale = await this.prisma.scale.findMany({
      where: {
        name: {
          contains: scaleName,
        },
        scaleTypeId,
      },
    });
    return { data: scale };
  }
  // 根据类型获取量表
  async getScaleByType(scaleTypeId: number): Promise<ScaleReturnType> {
    try {
      const scales = await this.prisma.scale.findMany({
        where: {
          scaleTypeId: scaleTypeId,
        },
      });
      return { data: scales };
    } catch (e) {
      console.log(e);
      // 可以选择抛出异常或返回适当的错误信息
      throw new Error('无法获取量表名称数据');
    }
  }

  // 查找所有scale数据
  async findScales(): Promise<Scale[] | null> {
    return this.prisma.scale.findMany();
  }
}
