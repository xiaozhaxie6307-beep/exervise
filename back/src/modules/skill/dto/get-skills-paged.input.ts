import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetSkillsPagedInput {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageNumber: number;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class GetSkillUsersPagedInput {
  @Field(() => Int)
  skillId: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageNumber: number;
}
