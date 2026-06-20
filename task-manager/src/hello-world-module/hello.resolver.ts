
import { Resolver, Query } from '@nestjs/graphql';
import { Hello } from './hello.type';

@Resolver(() => Hello)
export class HelloResolver {
    @Query(() => Hello, { name: 'hello' })
    getHello(): Hello {
        return { message: 'Hello World!' };
    }
}