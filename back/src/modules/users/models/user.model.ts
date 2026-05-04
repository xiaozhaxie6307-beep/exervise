import 'reflect-metadata';

import {
  Field,
  HideField,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { BaseModel } from 'src/common/models/base.model';
import { Skill } from 'src/modules/skill/models/skill.model';
import { Unit } from 'src/modules/unit/models/unit.model';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @Field()
  uuid: string;

  @Field()
  username: string;

  @HideField()
  password: string;

  @Field()
  realname: string;

  @Field(() => Boolean, { nullable: true })
  isEnable?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean | null;

  @Field(() => Int, { nullable: true })
  gender?: number | null;

  @Field(() => Int, { nullable: true })
  age?: number | null;

  @Field(() => String, { nullable: true })
  telephone?: string | null;

  @Field(() => Int, { nullable: true })
  marital?: number | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => Int, { nullable: true })
  job_number?: number | null;

  @Field(() => String, { nullable: true })
  nationality?: string | null;

  @Field(() => Int, { nullable: true })
  working_year?: number | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => String, { nullable: true })
  province?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  district?: string | null;

  @Field(() => String, { nullable: true })
  addressDetail?: string | null;

  @Field(() => String, { nullable: true })
  qualification?: string | null;

  @Field(() => String, { nullable: true })
  introduction?: string | null;

  @Field(() => String, { nullable: true })
  remark?: string | null;

  @Field(() => String, { nullable: true })
  firstname?: string | null;

  @Field(() => String, { nullable: true })
  lastname?: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Int, { nullable: true })
  unitId?: number | null;

  @Field(() => Unit, { nullable: true })
  unit?: Unit | null;

  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}
