import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GetExperiencesPagedInput } from './dto/get-experiences-paged.input';
import { SubmitExperienceInput } from './dto/submit-experience.input';
import { ExperienceService } from './experience.service';
import { Experience } from './models/experience.model';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private experienceService: ExperienceService) {}

  @Query(() => [Experience])
  async getExperiencesPaged(
    @Args('data') data: GetExperiencesPagedInput
  ): Promise<Experience[]> {
    return this.experienceService.getExperiencesPaged(data) as Promise<
      Experience[]
    >;
  }

  @Query(() => Int)
  async getExperiencesTotal(
    @Args('data') data: GetExperiencesPagedInput
  ): Promise<number> {
    return this.experienceService.getExperiencesTotal(data);
  }

  @Query(() => Experience, { nullable: true })
  async getExperienceDetail(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Experience | null> {
    return this.experienceService.getExperienceDetail(id) as Promise<
      Experience | null
    >;
  }

  @Mutation(() => Experience)
  async submitExperience(
    @Args('data') data: SubmitExperienceInput
  ): Promise<Experience> {
    return this.experienceService.submitExperience(data) as Promise<Experience>;
  }

  @Mutation(() => Experience)
  async deleteExperience(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Experience> {
    return this.experienceService.deleteExperience(id) as Promise<Experience>;
  }
}
