import { Controller, Get, HttpStatus, Post, HttpCode, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './dto/auth/auth.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

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

      const { password, ...payload } = user;

      //FIXME: Generar refresh token por 7d
      const refresh = await this.utilSvc.generateJwt(payload, '7d');
      const hashRT = await this.utilSvc.hash(refresh);
     
      const updateUser = await this.authSvc.updateHash(user.id, hashRT)

      //Obtener token de acceso por 60s
      payload.hash = hashRT
      const jwt = await this.utilSvc.generateJwt(payload, '60s');
      return { 
         access_token: jwt, 
         refresh_token: hashRT
     };

    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }




  @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la información' })
  @Get("me")
  public async getProfile(@Req() request: any) {
       return user;
  }


  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entrega un nuevo  "Access Token "' })
  public async refreshToken(@Req() request: any) {

       // Obtener el usuario en sesion
      const userSession = request ['user'];
      const user = await this.authSvc.getUserById(userSession.id);
      if (!user || !user.hash) throw new AppException('Acceso Denegado', HttpStatus.FORBIDDEN, '0')

        console.log(userSession.hash);
       // Compara el token recibido con el token guardado

      if ( userSession.hash != user.hash)throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '0')
       console.log(user)

       // Si el token es valido se egeneran nuevos tokens
       return {
        token: '',
        refreshToken: ''
       }
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Invalida los tokens en el lado del servidor y limpia las cookies' })
  public async logout(@Req() request: any,) {
     const session = request['user'];
      const user =  await this.authSvc.updateHash(session.id, null);
      return user;
  }

}