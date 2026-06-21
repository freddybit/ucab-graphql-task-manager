import { InputType, Int, Field } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';

@InputType()
export class CreateTaskInput {

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string;

  @Field(() => [String], { nullable: true })
  tags!: string[];

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => Int)
  idUser!: number;

  @Field(() => Int)
  idProject!: number;
}
