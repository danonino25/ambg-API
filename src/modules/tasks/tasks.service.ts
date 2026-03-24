
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/task/create-task.dto';
import { Task } from '../auth/entities/task.entity';
import { UpdateTaskDto } from '../auth/dto/task/update-task.dto';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class TaskService {

  constructor(
    private prisma: PrismaService
  ) {

  }

  private tasks: Task[] = [];

  public async getTasks(userId: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        user_id: id
      }
    });
    return tasks;
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { 
              id,
               user_id
       }
    });
    return task;
  }

  public async insertTask(task: CreateTaskDto): Promise<Task> {
  const newtask = await this.prisma.task.create({
    data: {
      name: task.name,
      description: task.description,
      priority: task.priority,
      user: {
        connect: { id: task.userId }
      }
    }
  });

  return newtask;
}

public async updateTask(id: number, user_id: number,taskUpdated: UpdateTaskDto): Promise<Task>{
        // console.log(taskUpdated);
        const task = await this.prisma.task.update({
            where: {
                id: id , user_id
            },
            data: taskUpdated
        });
        return task;
}

  public async deleteTask(id: number, user_id): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where: { id , user_id},
    });
    return !!task;
  }
}