import 'reflect-metadata';

import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Skill extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  level: number | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Int, { nullable: true })
  userCount?: number;
}

@ObjectType()
export class SkillUser {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  realname: string;

  @Field(() => String, { nullable: true })
  telephone: string | null;

  @Field(() => Int, { nullable: true })
  unitId: number | null;
}
