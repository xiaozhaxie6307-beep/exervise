import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/auth/password.service';

import type { ChangePasswordInput } from './dto/change-password.input';
import type { UpdateUserInput } from './dto/update-user.input';
import type { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  updateUser(
    userId: number,
    newUserData: UpdateUserInput
  ): Prisma.Prisma__UserClient<User, never> {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordInput
  ): Promise<User> {
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
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
