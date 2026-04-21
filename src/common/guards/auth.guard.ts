import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UtilService } from '../services/util.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly utilSvc: UtilService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request; //switchToHttp() para obtener el objeto de solicitud HTTP
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(); // No se proporcionó un token, denegar acceso 401

    try {
      const payload = await this.utilSvc.getPayload(token); // Verificar el token y obtener el payload
      request['user'] = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(); // Token inválido o expirado, denegar acceso 401
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Primero intentamos extraer de las cookies (at = access token)
    if (request.cookies && request.cookies['at']) {
      return request.cookies['at'];
    }

    // Fallback al header de Authorization (mantener por compatibilidad si se desea)
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}