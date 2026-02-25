import { Query } from './../../../node_modules/@types/pg/index.d';
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dbo';
import { Client } from 'pg';
import { Task } from '../auth/entities/task.entity';
import { UpdateTaskDto } from '../auth/dto/update_task.dto';

@Injectable()
export class TaskService {

  constructor(@Inject('DATABASE_CONNECTION') private databaseConnection: Client) {

  }

  private tasks: any[] = [];

  public async getTasks(): Promise<any[]> {
    const query = 'SELECT * FROM task';
    const result = await this.databaseConnection.query(query);
    return result.rows;
  }

  public async getTaskById(id: number): Promise<Task> {
    const query = 'SELECT * FROM task WHERE id = $1';
    const result = await this.databaseConnection.query(query, [id]);
    return result.rows[0];
  }

  public async insertTask(task: CreateTaskDto): Promise<any> {
    const query = 'INSERT INTO task(name, description, priority, user_id) VALUES($1, $2, $3, $4) RETURNING *';
    const result = await this.databaseConnection.query(query, [task.name, task.description, task.priority, task.user_id]);
    return result.rows;
  }

  public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<any>{
    const task = await this.getTaskById(id);
    task.name = taskUpdated.name ?? task.name;
    task.description = taskUpdated.description ?? task.description;
    task.priority = taskUpdated.priority ?? task.priority;

    const query = 'UPDATE task SET name = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *';
    const result = await this.databaseConnection.query(query, [taskUpdated.name, taskUpdated.description, taskUpdated.priority, id]);
    
    return result.rows[0];
  }

  public async deleteTask(id: number): Promise<boolean> {
    const sql = 'DELETE FROM task WHERE id = $1';
    const result = await this.databaseConnection.query(sql, [id]);
    return result.rowCount !> 0;
  }
}
