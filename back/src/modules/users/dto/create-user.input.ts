import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  realname: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => Int, { nullable: true })
  unitId?: number | null;

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

  @Field(() => String, { nullable: true })
  province?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  district?: string | null;

  @Field(() => String, { nullable: true })
  addressDetail?: string | null;

  @Field(() => String, { nullable: true })
  qualification?: string | null;

  @Field(() => String, { nullable: true })
  introduction?: string | null;

  @Field(() => String, { nullable: true })
  remark?: string | null;
}
