import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SubmitUnitInput {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field()
  name: string;

  @Field({ nullable: true })
  code?: string | null;

  @Field({ nullable: true })
  isEnable?: boolean | null;

  @Field({ nullable: true })
  remark?: string | null;
}
