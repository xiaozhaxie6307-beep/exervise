import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  GetSkillUsersPagedInput,
  GetSkillsPagedInput,
} from './dto/get-skills-paged.input';
import { SkillUsersReturn } from './dto/skill-users.return';
import {
  SubmitSkillInput,
  UserSkillRelationInput,
} from './dto/submit-skill.input';
import { Skill } from './models/skill.model';
import { SkillService } from './skill.service';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private skillService: SkillService) {}

  @Query(() => [Skill])
  async getSkillsPaged(
    @Args('data') data: GetSkillsPagedInput
  ): Promise<Skill[]> {
    return this.skillService.getSkillsPaged(data);
  }

  @Query(() => Int)
  async getSkillsTotal(
    @Args('data') data: GetSkillsPagedInput
  ): Promise<number> {
    return this.skillService.getSkillsTotal(data);
  }

  @Query(() => Skill, { nullable: true })
  async getSkillDetail(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Skill | null> {
    return this.skillService.getSkillDetail(id);
  }

  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[]> {
    return this.skillService.getAllSkills();
  }

  @Query(() => SkillUsersReturn)
  async getSkillUsersPaged(
    @Args('data') data: GetSkillUsersPagedInput
  ): Promise<SkillUsersReturn> {
    return this.skillService.getSkillUsersPaged(data);
  }

  @Mutation(() => Skill)
  async submitSkill(@Args('data') data: SubmitSkillInput): Promise<Skill> {
    return this.skillService.submitSkill(data);
  }

  @Mutation(() => Skill)
  async deleteSkill(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Skill> {
    return this.skillService.deleteSkill(id);
  }

  @Mutation(() => Boolean)
  async attachSkillToUser(
    @Args('data') data: UserSkillRelationInput
  ): Promise<boolean> {
    return this.skillService.attachSkillToUser(data);
  }

  @Mutation(() => Boolean)
  async detachSkillFromUser(
    @Args('data') data: UserSkillRelationInput
  ): Promise<boolean> {
    return this.skillService.detachSkillFromUser(data);
  }
}
