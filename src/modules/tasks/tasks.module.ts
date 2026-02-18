import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { databaseProvider } from 'src/common/providers/database.provider';

@Module({
  controllers: [TaskController],
  providers: [TaskService, databaseProvider[0]],
})
export class TaskModule {}
