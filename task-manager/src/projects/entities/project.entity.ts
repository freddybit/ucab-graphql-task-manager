import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Project {

  @Field(() => ID)
  idProject: number = 0;

  @Field(() => String)
  projectName: string = '';

  @Field(() => String)
  projectDescription: string = '';

}
