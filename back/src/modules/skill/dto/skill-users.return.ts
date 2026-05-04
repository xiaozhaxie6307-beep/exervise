import { Field, Int, ObjectType } from '@nestjs/graphql';

import { SkillUser } from '../models/skill.model';

@ObjectType()
export class SkillUsersReturn {
  @Field(() => [SkillUser])
  rows: SkillUser[];

  @Field(() => Int)
  total: number;
}
