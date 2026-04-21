import { Query } from 'pg';
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Task } from '../../auth/entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PrismaService } from '../../../common/services/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TaskService {

  constructor(
    @Inject('DATABASE_CONNECTION') private databaseConnection: Client,
    private prisma: PrismaService
  ) {

  }

  private tasks: any[] = [];

  public async getTasks(id: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: id
      }
    });
    return tasks;
  }
   
  public async getTaskById(id: number, user_id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { 
        id, 
        userId: user_id
       },
    });
    return task;
  }

  public async insertTask(task: CreateTaskDto, userId: number): Promise<Task> {
    const newtask = await this.prisma.task.create({
      data: { ...task, userId }
    });
    return newtask;
  }

public async updateTask(id: number, taskUpdated: UpdateTaskDto, user_id: number): Promise<Task>{
        // console.log(taskUpdated);
        const task = await this.prisma.task.update({
            where: {
                id: id,
                userId: user_id
            },
            data: taskUpdated
        });
        return task;
}

  public async deleteTask(id: number, user_id: number): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where: { id, userId: user_id },
    });
    return !!task;
  }
}