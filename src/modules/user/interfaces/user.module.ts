import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { databaseProvider } from '../../../common/providers/database.provider';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, databaseProvider[0], UserService, UtilService],
})
export class UserModule {}