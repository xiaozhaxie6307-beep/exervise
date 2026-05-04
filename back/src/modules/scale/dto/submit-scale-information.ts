import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SubmitBaseInformation {
  @Field(() => Int, { nullable: true })
  id: number | null;

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

  @Field(() => Boolean)
  isEnable: boolean;

  @Field(() => String, { nullable: true })
  scaleCoverUrl: string | null;

  @Field(() => String, { nullable: true })
  scaleContentImg: string | null;

  @Field(() => String, { nullable: true })
  teamIntroduction: string | null;

  @Field(() => Boolean)
  isComprehensiveReport: boolean;

  @Field(() => Int, { nullable: true })
  startAge: number | null;

  @Field(() => Int, { nullable: true })
  endAge: number | null;

  @Field(() => Int)
  warnGender: number;

  @Field(() => String, { nullable: true })
  skipRule: string | null;

  @Field(() => Boolean)
  isFactor: boolean;

  @Field(() => Boolean)
  isSkip: boolean;

  @Field(() => Boolean)
  isTeam: boolean;

  @Field(() => Int)
  scaleTypeId: number;
}
