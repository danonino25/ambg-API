import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  public getTasks(): string[] {
    return ['Task 1', 'Task 2', 'Task 3'];
  }
}
