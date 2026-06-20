import { CreateProjectInput } from './create-project.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => ID)
  idProject!: number;

  @Field(() => String)
  projectName!: string;

  @Field(() => String)
  projectDescription!: string;
}
