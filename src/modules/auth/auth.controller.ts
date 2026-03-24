import { Controller, Get, HttpStatus, Post, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth/auth.dto';
import { UtilService } from 'src/common/services/util.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) { }

  // POST /register 200
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' })
  public async logIn(@Body() auth: AuthDto): Promise<any> {
    const { username, password } = auth;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user)
      throw new UnauthorizedException('Credenciales inválidas');

    if (await this.utilSvc.checkPassword(password, user.password!)) {

      //Obtener token de acceso por 60s
      const { password, ...payload } = user;

      const jwt = await this.utilSvc.generateJwt(payload);
      //FIXME: Generar refresh token por 7d
      const refresh = await this.utilSvc.generateJwt(payload, '7d');
      return { access_token: jwt, refresh_token: refresh };

    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }




  @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la información' })
  @Get("me")
  public async getProfile() {

  }


  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entrega un nuevo  "Access Token "' })
  public async refreshToken() {

  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Invalida los tokens en el lado del servidor y limpia las cookies' })
  public async logout() {

  }

}