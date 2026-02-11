/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }
  @Get()
  public fetchTasks(): any {
    return this.taskSvc.getTasks();
  }

  /** !GET http:localhost:3000/api/task/1 */
  @Get(":id")
  public getTaskById(@Param("id", ParseIntPipe) id: number): any {
    var task = this.taskSvc.getTaskById(id);
    if (task) return task;

    else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    

  }
  /** !POST GET http:localhost:3000/api/task*/
  @Post()
  public insertTask(@Body() task: any): any {
    return this.taskSvc.insertTask(task);
  }
  @Put(":id")
  public updateTask(@Body("id", ParseIntPipe) id: number, task: any): any {
    return this.taskSvc.updateTask(id, task);
  }
  @Delete()
  public deleteTask(@Param("id", ParseIntPipe) id: number): any {
    return this.taskSvc.deleteTask(id);
  }
}