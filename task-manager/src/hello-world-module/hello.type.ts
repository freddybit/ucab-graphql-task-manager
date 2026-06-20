
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Hello {
  @Field(() => String)
  message: string = '';
}