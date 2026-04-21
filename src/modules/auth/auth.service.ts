import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { User } from '../user/entities/user.entity';
import { UtilService } from '../../common/services/util.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
              private readonly util: UtilService
  ) {}

  public async getUserByUserName(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  public async updateHash(user_Id: number, hash: string | null): Promise<User> {
    return await this.prisma.user.update({
      where: { id: user_Id },
      data: { hash },
    });
  }

  public logIn(): string {
    return 'Login exitoso';
  }

  async generateTokens(payload: any) {
  const accessToken = await this.util.generateJWT(payload, '15m');
  const refreshToken = await this.util.generateJWT(payload, '7d');

  const hashRT = await this.util.hash(refreshToken);

  await this.updateHash(payload.id, hashRT);

  return {
    accessToken,
    refreshToken,
    hashRT
  };
}
}