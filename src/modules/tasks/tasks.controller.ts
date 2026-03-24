/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, HttpCode, Req } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from '../auth/dto/task/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/task/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags()
@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  @ApiOperation({ summary: 'Lista de Tareas Disponibles' })
  public async getTasks(@Req() request: any): Promise<any[]> {
    const user = request['user']?.id; // Obtener el ID del usuario autenticado
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.taskSvc.getTasks(user);
  }

  /** !GET http:localhost:3000/api/task/1 */
  // %27%20OR%20%271%27=%271
  // ' OR '1'='1
  // ' UNION SELECT * FROM users 
  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<any> {
    var task = await this.taskSvc.getTaskById(id, user.id);
    if (task) return task;
    else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  /** !POST GET http:localhost:3000/api/task*/
  @Post()
  public async insertTask(@Body() task: CreateTaskDto): Promise<any> {
    return this.taskSvc.insertTask(task);
  }

  @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body()task: UpdateTaskDto): Promise<any>{      
        return await this.taskSvc.updateTask(id,user.id, task);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    try {
      return await this.taskSvc.deleteTask(id);
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}