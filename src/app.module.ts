import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/tasks.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from './prisma.service'
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, TaskModule,PrismaModule, UserModule],
  providers: [PrismaService]
  
})
export class AppModule {}
