import { ArgumentsHost, Catch,ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { timeStamp } from "console";
import { stat } from "fs";
import { request } from "http";


@Catch()
export class    AllExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status=
       exception instanceof HttpException
       ? exception.getStatus()
       : HttpStatus.INTERNAL_SERVER_ERROR;


       const message =
       exception instanceof HttpException
       ? exception.getResponse()
       : 'Internal Server Error';

       // git commit -a -m "fix: Almacenamiento de logs"
        //FIXE: Almacenar la informacion en la base de datos 
       response.status(status).json({
         statusCode: status,
         timeStamp: new Date().toISOString(),
         path: request.url,
         error: 
             typeof message == 'string' 
             ? message
             : (message as any).message || message,
        errorCode: (exception as any).code || 'UNKNOWN_ERROR'
       })
       
    }
}