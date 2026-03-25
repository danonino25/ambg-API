import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UtilService {
    constructor(private readonly jwtSvc: JwtService){}

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public async generateJwt(payload: any, expiresIn: any = '60'): Promise<string> {
        const token = await this.jwtSvc.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: expiresIn });
        return token;
    }

    public async getPayload(jwt: string): Promise<any>{
        return await this.jwtSvc.verifyAsync(jwt, { secret: process.env.JWT_SECRET });
    }
}
