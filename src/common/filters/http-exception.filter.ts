import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../services/prisma.service';

@Injectable()
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

  
    let status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception instanceof HttpException 
      ? exception.getResponse() 
      : 'Internal Server Error';

  
    let errorCode = (exception as any).code || (exception as any).errorCode || 'UNKNOWN_ERROR';

    if (errorCode === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'Ya existe un registro con esos datos (Restricción de duplicado )';
    } else if (errorCode === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'El registro solicitado no existe';
    }

    
    const friendlyMessage = typeof message === 'object' && (message as any).message 
      ? (message as any).message 
      : message;

    const errorContent = typeof friendlyMessage === 'string' 
      ? friendlyMessage 
      : JSON.stringify(friendlyMessage);

    const sessionId = (request as any).user?.id || null;

    // 4. PERSISTENCIA EN LA BASE DE DATOS (Audit Trail)
    try {
      await (this.prisma as any).logs.create({
        data: {
          statusCode: status,
          path: request.url,
          error: errorContent,
          errorCode: String(errorCode),
          session_id: sessionId,
          timestamp: new Date()
        },
      });
    } catch (dbError: any) {
    
      console.error('CRITICAL: No se pudo guardar el log en la base de datos:', dbError.message);
    }

   
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: friendlyMessage, 
      errorCode: errorCode,
      method: request.method
    });
  }
}