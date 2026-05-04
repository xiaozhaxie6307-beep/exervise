import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetUsersPagedInput {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageNumber: number;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  realname?: string;

  @Field(() => Int, { nullable: true })
  unitId?: number;
}
