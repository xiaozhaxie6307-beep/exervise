import 'reflect-metadata';

import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { ScaleType } from 'src/modules/scale-type/models/scale-type.models';

@ObjectType()
export class Scale extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  uuid: string;

  @Field(() => Int, { nullable: true })
  scaleTypeId: number | null;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  scacleCode: string | null;

  @Field(() => String, { nullable: true })
  calformula: string | null;

  @Field(() => String, { nullable: true })
  tranformulakey: string | null;

  @Field(() => String, { nullable: true })
  tranformula: string | null;

  @Field(() => Float, { nullable: true })
  average: number | null;

  @Field(() => Float, { nullable: true })
  sd: number | null;

  @Field(() => String, { nullable: true })
  scaleInterpretationResult: string | null;

  @Field(() => Int, { nullable: true })
  baselineScore: number | null;

  @Field(() => String, { nullable: true })
  standardSourceMethod: string | null;

  @Field(() => String, { nullable: true })
  rawSourceMethod: string | null;

  @Field(() => String, { nullable: true })
  averageSourceMethod: string | null;

  @Field(() => Boolean, { nullable: true })
  scaleTimeKeeping: boolean | null;

  @Field(() => Int, { nullable: true })
  scaleTimeLimit: number | null;

  @Field(() => String, { nullable: true })
  introduction: string | null;

  @Field(() => String, { nullable: true })
  instructions: string | null;

  @Field(() => Boolean, { nullable: true })
  isEnable: boolean | null;

  @Field(() => String, { nullable: true })
  scaleCoverUrl: string | null;

  @Field(() => String, { nullable: true })
  scaleContentImg: string | null;

  @Field(() => Boolean, { nullable: true })
  isTeam: boolean | null;

  @Field(() => String, { nullable: true })
  teamIntroduction: string | null;

  @Field(() => Boolean, { nullable: true })
  isComprehensiveReport: boolean | null;

  @Field(() => Int, { nullable: true })
  startAge: number | null;

  @Field(() => Int, { nullable: true })
  endAge: number | null;

  @Field(() => Int, { nullable: true })
  warnGender: number | null;

  @Field(() => String, { nullable: true })
  skipRule: string | null;

  @Field(() => Boolean, { nullable: true })
  isSkip: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isFactor: boolean | null;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class ScaleWithType extends BaseModel {
  @Field()
  name: string;

  @Field(() => Int)
  scaleTypeId: number;

  @Field(() => ScaleType)
  scaleType: ScaleType;

  @Field(() => String, { nullable: true })
  scacleCode: string | null;

  @Field(() => String, { nullable: true })
  calformula: string | null;

  @Field(() => String, { nullable: true })
  tranformulakey: string | null;

  @Field(() => String, { nullable: true })
  tranformula: string | null;

  @Field(() => Float, { nullable: true })
  average: number | null;

  @Field(() => Int, { nullable: true })
  sd: number | null;

  @Field(() => String, { nullable: true })
  scaleInterpretationResult: string | null;

  @Field(() => Int, { nullable: true })
  baselineScore: number | null;

  @Field(() => String, { nullable: true })
  standardSourceMethod: string | null;

  @Field(() => String, { nullable: true })
  rawSourceMethod: string | null;

  @Field(() => String, { nullable: true })
  averageSourceMethod: string | null;

  @Field(() => Boolean, { nullable: true })
  scaleTimeKeeping: boolean | null;

  @Field(() => Int, { nullable: true })
  scaleTimeLimit: number | null;

  @Field(() => String, { nullable: true })
  introduction: string | null;

  @Field(() => String, { nullable: true })
  instructions: string | null;
}
