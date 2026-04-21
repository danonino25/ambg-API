import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { databaseProvider } from '../../../common/providers/database.provider';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, databaseProvider[0], PrismaService, UtilService],
})
export class TaskModule {}