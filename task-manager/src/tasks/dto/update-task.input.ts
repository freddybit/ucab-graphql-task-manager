import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { CreateTaskInput } from './create-task.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => ID)
  idTask!: number;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => [String])
  tags!: string[];

  @Field(() => Date)
  createdDate!: Date;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => Int)
  idUser!: number;

  @Field(() => Int)
  idProject!: number;
}
