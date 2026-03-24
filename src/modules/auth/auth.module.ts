import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from 'src/common/services/util.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule
  ],

  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService],
  exports:[AuthService]
})
export class AuthModule {}
