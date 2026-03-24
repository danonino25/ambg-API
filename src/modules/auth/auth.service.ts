import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  public async getUserByUsername(username: string): Promise<User | null>{
        return await this.prisma.user.findFirst({
        where: {
          username
        }
      });
  }

  public logIn(): string {
    return 'Sesión exitosa';
  }
}
