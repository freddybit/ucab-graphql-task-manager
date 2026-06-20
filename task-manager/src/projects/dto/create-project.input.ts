import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  projectName!: string;

  @Field(() => String)
  projectDescription!: string;
}
