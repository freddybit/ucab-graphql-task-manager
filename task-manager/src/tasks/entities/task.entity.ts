import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { TaskStatus } from '../enums/task-status.enum';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Task {
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

  @Field(() => User)
  user?: User;

  @Field(() => Project)
  project?: Project;
}
