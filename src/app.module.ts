import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/tasks.module';

@Module({
  imports: [AuthModule, TaskModule],
  
})
export class AppModule {}
