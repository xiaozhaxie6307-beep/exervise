import 'reflect-metadata';

import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class ExperienceUser {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  realname: string;
}

@ObjectType()
export class Experience extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field()
  uuid: string;

  @Field(() => Int)
  userId: number;

  @Field()
  organization: string;

  @Field(() => String, { nullable: true })
  position: string | null;

  @Field(() => Date, { nullable: true })
  startDate: Date | null;

  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  remark: string | null;

  @Field(() => ExperienceUser, { nullable: true })
  user?: ExperienceUser | null;
}
