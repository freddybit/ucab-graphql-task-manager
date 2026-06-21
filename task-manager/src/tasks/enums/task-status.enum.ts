import { registerEnumType } from "@nestjs/graphql";

export enum TaskStatus {
    BACKLOG = 'Backlog',
    TO_DO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

registerEnumType(TaskStatus, {
    name: 'TaskStatus',
    description: 'The status of a task',
});