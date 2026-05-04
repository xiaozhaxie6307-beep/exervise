import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { Scale } from '../models/scale.model';

@InputType()
export class QueryScaleIdByNameInput {
  @Field(() => Int)
  scaleTypeId: number;

  @Field(() => String)
  scaleName: string;
}

@ObjectType()
export class QueryScaleIdByNameReturnType {
  @Field(() => [Scale])
  data: Scale[];
}
