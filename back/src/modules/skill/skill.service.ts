import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Skill } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import type {
  GetSkillUsersPagedInput,
  GetSkillsPagedInput,
} from './dto/get-skills-paged.input';
import type {
  SubmitSkillInput,
  UserSkillRelationInput,
} from './dto/submit-skill.input';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(input: GetSkillsPagedInput): Prisma.SkillWhereInput {
    return {
      name: input.name ? { contains: input.name } : undefined,
    };
  }

  async getSkillsPaged(input: GetSkillsPagedInput): Promise<Skill[]> {
    const { currentPage, pageNumber } = input;
    return this.prisma.skill.findMany({
      where: this.buildWhere(input),
      skip: (currentPage - 1) * pageNumber,
      take: pageNumber,
      orderBy: { id: 'desc' },
    });
  }

  async getSkillsTotal(input: GetSkillsPagedInput): Promise<number> {
    return this.prisma.skill.count({ where: this.buildWhere(input) });
  }

  async getSkillDetail(id: number): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  async getAllSkills(): Promise<Skill[]> {
    return this.prisma.skill.findMany({ orderBy: { id: 'desc' } });
  }

  async submitSkill(input: SubmitSkillInput): Promise<Skill> {
    const { id, ...rest } = input;
    try {
      if (!id) {
        return await this.prisma.skill.create({
          data: { uuid: uuidv4(), ...rest },
        });
      }
      return await this.prisma.skill.update({ where: { id }, data: rest });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`技能"${rest.name}"已存在`);
      }
      throw e;
    }
  }

  async deleteSkill(id: number): Promise<Skill> {
    try {
      await this.prisma.mergeUserSkill.deleteMany({
        where: { skillId: id },
      });
      return await this.prisma.skill.delete({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  async getSkillUsersPaged(input: GetSkillUsersPagedInput): Promise<{
    rows: Array<{
      id: number;
      username: string;
      realname: string;
      telephone: string | null;
      unitId: number | null;
    }>;
    total: number;
  }> {
    const { skillId, currentPage, pageNumber } = input;
    const where = { skillId };
    const [merges, total] = await Promise.all([
      this.prisma.mergeUserSkill.findMany({
        where,
        skip: (currentPage - 1) * pageNumber,
        take: pageNumber,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              realname: true,
              telephone: true,
              unitId: true,
            },
          },
        },
      }),
      this.prisma.mergeUserSkill.count({ where }),
    ]);
    return {
      rows: merges.map((m) => m.user),
      total,
    };
  }

  async attachSkillToUser(input: UserSkillRelationInput): Promise<boolean> {
    try {
      await this.prisma.mergeUserSkill.create({
        data: { userId: input.userId, skillId: input.skillId },
      });
      return true;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException('该用户已拥有此技能');
      }
      throw e;
    }
  }

  async detachSkillFromUser(input: UserSkillRelationInput): Promise<boolean> {
    await this.prisma.mergeUserSkill.delete({
      where: {
        userId_skillId: { userId: input.userId, skillId: input.skillId },
      },
    });
    return true;
  }
}
