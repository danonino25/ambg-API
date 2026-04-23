import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from '../../common/services/util.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AppException } from '../../common/exceptions/app.exception';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly util: UtilService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y crea un JWT' })
  public async login(@Body() auth: AuthDTO, @Res({ passthrough: true }) res: Response): Promise<any> {
    const { username, password } = auth;

    // Verificar usuario y constraseña
    const user = await this.authSvc.getUserByUserName(username);
    if (!user)
      throw new UnauthorizedException(`El usuario no está registrado`);

    if (await this.util.checkPassword(password, user.password!)) {
      //obtener informacion de payload
      const { password, ...payload } = user;

      //generar refres token por 7d
      const refresh = await this.util.generateJWT(payload, '7d');
      const hashRT = await this.util.hash(refresh);
      await this.authSvc.updateHash(payload.id, hashRT);

      //generar token de acceso 60s
      payload.hash = hashRT;
      const jwt = await this.util.generateJWT(payload, '1h');

      // Configurar cookies seguras
      res.cookie('at', jwt, {
        httpOnly: true,
        secure: false, // Cambiar a true en producción con HTTPS
        sameSite: 'lax',
        maxAge: 3600000 // 1 hora
      });

      res.cookie('rt', hashRT, {
        httpOnly: true,
        secure: false, // Cambiar a true en producción con HTTPS
        sameSite: 'lax',
        maxAge: 604800000 // 7 días
      });

      return {
        message: 'Login exitoso',
        user: payload
      };
    } else {
      throw new UnauthorizedException(`Usuario y/o contraseña es  incorrecto`);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'obtiene el perfil del usuario autenticado' })
  public async getProfile(@Req() request: any) {
    const userSession = request['user'];
    const user = await this.authSvc.getUserById(userSession.id);

    if (user) {
      const { password, ...userData } = user;
      return userData;
    }

    return userSession;
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresca el token JWT' })
  public async refreshToken(@Req() request: any) {
    //Obtener usuario en sesion
    const userSession = request['user'];
    const user = await this.authSvc.getUserById(userSession.id);

    if (!user || !user.hash)
      throw new AppException('Acceso Denegado', HttpStatus.FORBIDDEN, '0');

    //comparar el token recibido con el guardado
    if (userSession.hash != user.hash)
      throw new AppException('Acceso Denegado', HttpStatus.FORBIDDEN, '0');

    //si el token es valido se generan nuevos tokens
    return {
      token: '',
      refresh_token: '',
    };
  }

 @Post('logout')
@HttpCode(HttpStatus.NO_CONTENT)
public async logout(@Req() request: any, @Res({ passthrough: true }) res: Response) {
  try {
    const session = request['user'];

    if (session?.id) {
      await this.authSvc.updateHash(session.id, '');
    }

    res.clearCookie('at');
    res.clearCookie('rt');

    return;
  } catch (error) {
    res.clearCookie('at');
    res.clearCookie('rt');
    return;
  }
}
}