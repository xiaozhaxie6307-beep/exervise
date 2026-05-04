import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetExperiencesPagedInput {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageNumber: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field({ nullable: true })
  organization?: string;
}
