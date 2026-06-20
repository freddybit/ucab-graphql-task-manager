import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Project {

  @Field(() => ID)
  idProject!: number;

  @Field(() => String)
  projectName!: string ;

  @Field(() => String)
  projectDescription!: string;

}
