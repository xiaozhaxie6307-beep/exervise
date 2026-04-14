import 'reflect-metadata';

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class ScaleType extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  uuid: string;

  @Field(() => String)
  name: string;
}
