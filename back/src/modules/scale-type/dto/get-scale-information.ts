import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class getScaleTypeInformationToWeightlessnessReduction {
  @Field(() => [String])
  scaleTypeNameList: string[];
}
