import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SubmitSkillInput {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  level?: number | null;

  @Field({ nullable: true })
  description?: string | null;
}

@InputType()
export class UserSkillRelationInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  skillId: number;
}
