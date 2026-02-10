import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  // ? http://localhost:3000/api/task
  @Get()
  public fetchTasks(): string[] {
    return this.taskSvc.getTasks();
  }

  @Get(':id')
  public getTaskById(@Param('id') id: number): any {
    return this.taskSvc.getTaskById(id);
  }

  @Post()
  public insertTask(task: any): any {
    return this.taskSvc.insertTask(task);
  }

  @Put()
  public updateTask(id: number, task: any): any {
    return this.taskSvc.updateTask(id, task);
  }

  @Delete()
  public deleteTask(id: number): any {
    return this.taskSvc.deleteTask(id);
  }
}
