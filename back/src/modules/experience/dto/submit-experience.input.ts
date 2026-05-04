import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SubmitExperienceInput {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field(() => Int)
  userId: number;

  @Field()
  organization: string;

  @Field({ nullable: true })
  position?: string | null;

  @Field(() => Date, { nullable: true })
  startDate?: Date | null;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field({ nullable: true })
  description?: string | null;

  @Field({ nullable: true })
  remark?: string | null;
}
