import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetUnitsPagedInput {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageNumber: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  code?: string;
}
