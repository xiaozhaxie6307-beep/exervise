import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  departmentId?: number;

  @Field({ nullable: true })
  @IsOptional()
  realname?: string;
}
