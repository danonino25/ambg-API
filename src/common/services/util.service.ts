import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilService {
  constructor(private readonly jwtSvc: JwtService) {}

  public async hash(text: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(text, saltRounds);
    return hashedPassword;
  }

  public async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return await bcrypt.compare(password, hashedPassword);
  }

  public async generateJWT(
    payload: any,
    expiresIn: any = '1h',
  ): Promise<string> {
    return await this.jwtSvc.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }

  public async getPayload(jwt: string): Promise<any> {
    return await this.jwtSvc.verifyAsync(jwt, {
      secret: process.env.JWT_SECRET,
    });
  }
  
}