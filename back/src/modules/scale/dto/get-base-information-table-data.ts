import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetBaseInformationTableData {
  @Field()
  currentPage: number;

  @Field()
  pageNumber: number;

  @Field({ nullable: true })
  scaleType?: number;

  @Field({ nullable: true })
  scaleName?: string;
}
