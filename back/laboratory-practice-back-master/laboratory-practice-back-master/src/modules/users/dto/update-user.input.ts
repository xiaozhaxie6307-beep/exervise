import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput {
  @Field()
  realname?: string;

  @Field(() => Boolean, { nullable: true })
  isEnable?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean | null;

  @Field(() => Int, { nullable: true })
  gender?: number | null;

  @Field(() => Int, { nullable: true })
  age?: number | null;

  @Field(() => String, { nullable: true })
  telephone?: string | null;

  @Field(() => Int, { nullable: true })
  marital?: number | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => Int, { nullable: true })
  job_number?: number | null;

  @Field(() => String, { nullable: true })
  nationality?: string | null;

  @Field(() => Int, { nullable: true })
  working_year?: number | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => String, { nullable: true })
  qualification?: string | null;

  @Field(() => String, { nullable: true })
  introduction?: string | null;

  @Field(() => Role)
  role?: Role;
}
