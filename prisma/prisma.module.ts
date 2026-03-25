import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService,AuthService],
  exports: [PrismaService],
})
export class PrismaModule {}