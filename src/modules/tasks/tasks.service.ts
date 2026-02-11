/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dbo';

@Injectable()
export class TaskService {
  private tasks: any[] = [];

  public getTasks(): any[] {
    return this.tasks;
  }

  public getTaskById(id: number): any {
    const task = this.tasks.find((data) => data.id == id);
    return task;
  }

  public insertTask(task: CreateTaskDto): any {
    const id = this.tasks.length + 1;
    const position = this.tasks.push({ ...task, id });
    return this.tasks[position - 1];
  }

  public updateTask(id: number, task: any): any {
    const taskUpdated = this.tasks.map((data) => {
      if (data.id == id) {
        if(task.name) data.name = task.name; 
        if(task.description) data.description = task.description; 
        if(task.priority != null) data.priority = task.priority; 

        return data;
      }
    });
    return taskUpdated;
  }

  public deleteTask(id: number): any {
    const array= this.tasks.filter((data) => data.id != id);
    this.tasks = array;
    return 'Task Deleted';
  }
}
