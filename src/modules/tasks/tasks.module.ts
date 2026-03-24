import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { databaseProvider } from 'src/common/providers/database.provider';
import { PrismaService } from 'src/common/services/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UtilService } from 'src/common/services/util.service';

@Module({
  controllers: [TaskController],
  imports:[PrismaModule],
  providers: [TaskService, databaseProvider[0], PrismaService, UtilService],
})
export class TaskModule {}