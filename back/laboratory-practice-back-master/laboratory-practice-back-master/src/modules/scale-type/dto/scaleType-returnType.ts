import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Scale } from 'src/modules/scale/models/scale.model';

import { ScaleType } from '../models/scale-type.models';

@ObjectType()
export class ScaleTypeReturnType {
  @Field(() => [ScaleType])
  data: ScaleType[];
}

@ObjectType()
export class ScaleReturnType {
  @Field(() => [Scale])
  data: Scale[];
}

@InputType()
export class getScaleTypeTableData {
  @Field()
  currentPage: number;

  @Field()
  pageNumber: number;

  @Field({ nullable: true })
  scaleTypeName?: string;
}

@InputType()
export class SubmitScaleTypeInformation {
  @Field(() => Int, { nullable: true })
  id: number | null;

  @Field(() => String)
  name: string;
}
