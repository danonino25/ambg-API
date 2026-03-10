import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { Task } from '@prisma/client'

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  public async getTasks():Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  public async getTaskById(id: number):Promise<Task | null>{
  const task = await this.prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  public async insertTask(task: CreateTaskDto):Promise<any>{
    const newTask = await this.prisma.task.create({
      data:task 
    });
    return newTask;
  }

  public async updateTask(id: number, taskUpdated: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: taskUpdated
    });
    return task;
  }

  public async deleteTask(id: number): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return true;
  }
}