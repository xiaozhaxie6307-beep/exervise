import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import type { getScaleTypeInformationToWeightlessnessReduction } from './dto/get-scale-information';
import type {
  getScaleTypeTableData,
  ScaleTypeReturnType,
  SubmitScaleTypeInformation,
} from './dto/scaleType-returnType';
import type { ScaleType } from './models/scale-type.models';

@Injectable()
export class ScaleTypeService {
  constructor(private prisma: PrismaService) {}
  async findScaleTypes(): Promise<ScaleType[]> {
    return await this.prisma.scaleType.findMany();
  }

  async getScaleTypes(): Promise<ScaleType[]> {
    const scaleTypes = await this.prisma.scaleType.findMany();
    return scaleTypes;
  }
  async getAllScaleTypeAndName(): Promise<ScaleTypeReturnType> {
    try {
      const scaleTypes = await this.prisma.scaleType.findMany({});
      return { data: scaleTypes };
    } catch (e) {
      console.log(e);
      // 可以选择抛出异常或返回适当的错误信息
      throw new Error('无法获取量表类型和名称数据');
    }
  }

  async getScaleTypeTableData(
    queryData: getScaleTypeTableData
  ): Promise<ScaleType[]> {
    const { currentPage, pageNumber, scaleTypeName } = queryData;
    const scaleWhere = {
      name: {
        contains: scaleTypeName,
      },
    };

    try {
      const scaleTypes = await this.prisma.scaleType.findMany({
        where: { ...scaleWhere },
        skip: (currentPage - 1) * pageNumber,
        take: pageNumber,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return scaleTypes;
    } catch (error) {
      console.log(error);
    }
    return new Promise(() => {
      return;
    });
  }

  async scaleTotalCount(queryData: getScaleTypeTableData): Promise<number> {
    const { scaleTypeName } = queryData;
    const scaleWhere = {
      name: {
        contains: scaleTypeName,
      },
    };

    const count = await this.prisma.scaleType.count({
      where: { ...scaleWhere },
    });

    return count;
  }

  async getScaleTypeDetail(id: number): Promise<ScaleType> {
    const scaleType = await this.prisma.scaleType.findUnique({
      where: {
        id,
      },
    });
    return scaleType
      ? scaleType
      : new Promise(() => {
          return;
        });
  }

  async submitScaleTypeInformation(
    data: SubmitScaleTypeInformation
  ): Promise<ScaleType | undefined> {
    const { id, ...others } = data || {};
    try {
      if (!id) {
        return this.prisma.scaleType.create({
          data: {
            ...others,
            uuid: uuidv4(),
          },
        });
      }
      return this.prisma.scaleType.update({
        data: {
          ...others,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  async getScaleTypeInformationToWeightlessnessReduction(): Promise<getScaleTypeInformationToWeightlessnessReduction> {
    const scaleTypeList = await this.prisma.scaleType.findMany();
    const scaleTypeNameList: string[] = [];
    scaleTypeList.forEach((scaleType) => {
      scaleTypeNameList.push(scaleType.name);
    });
    return { scaleTypeNameList };
  }
}
