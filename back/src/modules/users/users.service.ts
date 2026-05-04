import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/auth/password.service';
import { v4 as uuidv4 } from 'uuid';

import type { ChangePasswordInput } from './dto/change-password.input';
import type { CreateUserInput } from './dto/create-user.input';
import type { GetUsersPagedInput } from './dto/get-users-paged.input';
import type { UpdateUserInput } from './dto/update-user.input';

type UserWithRelations = PrismaUser & {
  unit?: any;
  skills?: Array<{ skill: any }>;
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  private buildWhere(input: GetUsersPagedInput): Prisma.UserWhereInput {
    return {
      username: input.username ? { contains: input.username } : undefined,
      realname: input.realname ? { contains: input.realname } : undefined,
      unitId: input.unitId ?? undefined,
    };
  }

  async findUsersPaged(input: GetUsersPagedInput): Promise<any[]> {
    const { currentPage, pageNumber } = input;
    const rows = (await this.prisma.user.findMany({
      where: this.buildWhere(input),
      skip: (currentPage - 1) * pageNumber,
      take: pageNumber,
      orderBy: { id: 'desc' },
      include: {
        unit: true,
        skills: { include: { skill: true } },
      },
    })) as UserWithRelations[];

    return rows.map((u) => ({
      ...u,
      skills: (u.skills ?? []).map((s) => s.skill),
    }));
  }

  async countUsers(input: GetUsersPagedInput): Promise<number> {
    return this.prisma.user.count({ where: this.buildWhere(input) });
  }

  async getUserDetail(id: number): Promise<any | null> {
    const u = (await this.prisma.user.findUnique({
      where: { id },
      include: { unit: true, skills: { include: { skill: true } } },
    })) as UserWithRelations | null;
    if (!u) return null;
    return { ...u, skills: (u.skills ?? []).map((s) => s.skill) };
  }

  async createUser(input: CreateUserInput): Promise<PrismaUser> {
    const { password, unitId, role, ...rest } = input;
    const hashedPassword = await this.passwordService.hashPassword(password);
    try {
      return await this.prisma.user.create({
        data: {
          ...rest,
          uuid: uuidv4(),
          password: hashedPassword,
          role: role ?? 'USER',
          ...(unitId ? { unit: { connect: { id: unitId } } } : {}),
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`用户名 ${rest.username} 已存在`);
      }
      throw e;
    }
  }

  updateUser(
    userId: number,
    newUserData: UpdateUserInput
  ): Prisma.Prisma__UserClient<PrismaUser, never> {
    const { id: _ignored, unitId, ...rest } = newUserData;
    return this.prisma.user.update({
      data: {
        ...rest,
        ...(unitId === undefined
          ? {}
          : unitId === null
          ? { unit: { disconnect: true } }
          : { unit: { connect: { id: unitId } } }),
      },
      where: { id: userId },
    });
  }

  async deleteUser(userId: number): Promise<PrismaUser> {
    try {
      await this.prisma.mergeUserSkill.deleteMany({ where: { userId } });
      await this.prisma.experience.deleteMany({ where: { userId } });
      await this.prisma.mergeUserScale.deleteMany({ where: { userId } });
      return await this.prisma.user.delete({ where: { id: userId } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        throw new BadRequestException('该用户存在关联数据，无法删除');
      }
      throw e;
    }
  }

  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordInput
  ): Promise<PrismaUser> {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: { password: hashedPassword },
      where: { id: userId },
    });
  }
}
