/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, HttpCode, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Task } from '../../auth/entities/task.entity';
import { User } from '../../user/entities/user.entity';

@ApiTags()
@Controller('api/task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  @ApiOperation({ summary: 'Lista de Tareas Disponibles' })
  public async fetchTasks(@Req() request: any): Promise<Task[]> {
    const userId = request['user'] as User; // Obtener el ID del usuario autenticado
    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.taskSvc.getTasks(userId.id);
  }

  /** !GET http:localhost:3000/api/task/1 */
  // %27%20OR%20%271%27=%271
  // ' OR '1'='1
  // ' UNION SELECT * FROM users 
  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<any> {
    const userId = request['user']?.id;
    var task = await this.taskSvc.getTaskById(id, userId);
    if (task) return task;
    else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  /** !POST GET http:localhost:3000/api/task*/
  @Post()
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<any> {
    const userId = request['user']?.id;
    return this.taskSvc.insertTask(task, userId);
  }

  @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body()task: UpdateTaskDto, @Req() request: any): Promise<any>{      
        const userId = request['user']?.id;
        return await this.taskSvc.updateTask(id, task, userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<boolean> {
    const userId = request['user']?.id;
    try {
      return await this.taskSvc.deleteTask(id, userId);
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}