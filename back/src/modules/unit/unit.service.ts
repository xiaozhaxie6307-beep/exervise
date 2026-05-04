import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Unit } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import type { GetUnitsPagedInput } from './dto/get-units-paged.input';
import type { SubmitUnitInput } from './dto/submit-unit.input';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(input: GetUnitsPagedInput): Prisma.UnitWhereInput {
    return {
      name: input.name ? { contains: input.name } : undefined,
      code: input.code ? { contains: input.code } : undefined,
    };
  }

  async getUnitsPaged(input: GetUnitsPagedInput): Promise<Unit[]> {
    const { currentPage, pageNumber } = input;
    return this.prisma.unit.findMany({
      where: this.buildWhere(input),
      skip: (currentPage - 1) * pageNumber,
      take: pageNumber,
      orderBy: { id: 'desc' },
    });
  }

  async getUnitsTotal(input: GetUnitsPagedInput): Promise<number> {
    return this.prisma.unit.count({ where: this.buildWhere(input) });
  }

  async getUnitDetail(id: number): Promise<Unit | null> {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  async getAllUnits(): Promise<Unit[]> {
    return this.prisma.unit.findMany({ orderBy: { id: 'desc' } });
  }

  async submitUnit(input: SubmitUnitInput): Promise<Unit> {
    const { id, name, code, isEnable, remark } = input;
    const data = {
      name,
      code: code ?? undefined,
      remark: remark ?? undefined,
      ...(isEnable === null || isEnable === undefined
        ? {}
        : { isEnable }),
    };
    if (!id) {
      return this.prisma.unit.create({
        data: { uuid: uuidv4(), ...data, name },
      });
    }
    return this.prisma.unit.update({ where: { id }, data });
  }

  async deleteUnit(id: number): Promise<Unit> {
    try {
      return await this.prisma.unit.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        throw new BadRequestException('该单位下还有用户，无法删除');
      }
      throw e;
    }
  }
}
