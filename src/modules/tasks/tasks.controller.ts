import { Controller, Get } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}
  @Get('1')
  public fetchTasks(): string[] {
    return this.taskSvc.getTasks();
  }
}
