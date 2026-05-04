import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';

import { ChangePasswordInput } from './dto/change-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { GetUsersPagedInput } from './dto/get-users-paged.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Query(() => [User])
  async getUsersPaged(
    @Args('data') data: GetUsersPagedInput
  ): Promise<User[]> {
    return this.usersService.findUsersPaged(data) as Promise<User[]>;
  }

  @Query(() => Int)
  async getUsersTotal(
    @Args('data') data: GetUsersPagedInput
  ): Promise<number> {
    return this.usersService.countUsers(data);
  }

  @Query(() => User, { nullable: true })
  async getUserDetail(
    @Args('id', { type: () => Int }) id: number
  ): Promise<User | null> {
    return this.usersService.getUserDetail(id) as Promise<User | null>;
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.usersService.createUser(data) as Promise<User>;
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('id', { type: () => Int }) id: number
  ): Promise<User> {
    return this.usersService.deleteUser(id) as Promise<User>;
  }

  @Mutation(() => User)
  async updateUserById(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserInput
  ): Promise<User> {
    return this.usersService.updateUser(id, data) as Promise<User>;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ): Promise<User> {
    return this.usersService.updateUser(user.id, newUserData) as Promise<User>;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ): Promise<User> {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    ) as Promise<User>;
  }
}
