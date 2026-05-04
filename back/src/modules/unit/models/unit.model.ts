import 'reflect-metadata';

import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Unit extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => Boolean, { nullable: true })
  isEnable: boolean | null;

  @Field(() => String, { nullable: true })
  remark: string | null;

  @Field(() => Int, { nullable: true })
  userCount?: number;
}
