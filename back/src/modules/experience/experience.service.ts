import { Injectable } from '@nestjs/common';
import { Experience, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import type { GetExperiencesPagedInput } from './dto/get-experiences-paged.input';
import type { SubmitExperienceInput } from './dto/submit-experience.input';

type ExperienceWithUser = Experience & {
  user?: { id: number; username: string; realname: string } | null;
};

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(
    input: GetExperiencesPagedInput
  ): Prisma.ExperienceWhereInput {
    return {
      userId: input.userId ?? undefined,
      organization: input.organization
        ? { contains: input.organization }
        : undefined,
    };
  }

  async getExperiencesPaged(
    input: GetExperiencesPagedInput
  ): Promise<ExperienceWithUser[]> {
    const { currentPage, pageNumber } = input;
    return this.prisma.experience.findMany({
      where: this.buildWhere(input),
      skip: (currentPage - 1) * pageNumber,
      take: pageNumber,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, realname: true },
        },
      },
    });
  }

  async getExperiencesTotal(
    input: GetExperiencesPagedInput
  ): Promise<number> {
    return this.prisma.experience.count({ where: this.buildWhere(input) });
  }

  async getExperienceDetail(id: number): Promise<ExperienceWithUser | null> {
    return this.prisma.experience.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, realname: true },
        },
      },
    });
  }

  async submitExperience(
    input: SubmitExperienceInput
  ): Promise<ExperienceWithUser> {
    const { id, userId, ...rest } = input;
    const data = {
      ...rest,
      organization: rest.organization,
      user: { connect: { id: userId } },
    };

    if (!id) {
      return this.prisma.experience.create({
        data: { uuid: uuidv4(), ...data },
        include: {
          user: { select: { id: true, username: true, realname: true } },
        },
      });
    }
    return this.prisma.experience.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, username: true, realname: true } },
      },
    });
  }

  async deleteExperience(id: number): Promise<Experience> {
    return this.prisma.experience.delete({ where: { id } });
  }
}
