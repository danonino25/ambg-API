/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from '../auth/dto/create-task.dbo';


@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }
  @Get()
  public async fetchTasks(): Promise<any[]> {
    return this.taskSvc.getTasks();
  }

  /** !GET http:localhost:3000/api/task/1 */
  // %27%20OR%20%271%27=%271
  // ' OR '1'='1
  // ' UNION SELECT * FROM users 
  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<any> {
    var task = await this.taskSvc.getTaskById(id);
    if (task && task.length > 0) return task;
    else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }
  /** !POST GET http:localhost:3000/api/task*/
  @Post()
  public async insertTask(@Body() task: CreateTaskDto): Promise<any> {
    return this.taskSvc.insertTask(task);
  }
  @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body()task: any): Promise<any>{      
        return await this.taskSvc.updateTask(id, task);
  }
  @Delete()
  public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.taskSvc.deleteTask(id);
  }
}