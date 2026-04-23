import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard'; // Importar el nuevo Guard
import { Roles } from '../../auth/decorators/roles.decorator';// Importar el nuevo Decorador
import { Role } from '@prisma/client';

@ApiTags('Usuarios')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  // REQUISITO: El admin puede ver todos los usuarios
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  public async getUsers(@Req() request: any): Promise<any[]> {
    // Extraemos el ID del usuario que hace la petición (auditoría)
    const { id } = request.user; 
    return await this.userSvc.getUsers(id); // Pasamos el ID que el servicio está pidiendo
  }

  // REQUISITO: Ver un usuario específico (Solo Admin o el mismo usuario)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any
  ): Promise<any> {
    const currentUser = request['user'];
    if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
      throw new HttpException('No tienes permisos para ver este perfil', HttpStatus.FORBIDDEN);
    }
    const user = await this.userSvc.getUserById(id);
    if (!user) throw new HttpException(`Usuario no encontrado`, 404);
    return user;
  }

  @Post('/insert-user')
  @ApiOperation({ summary: 'Registro para user ordinario (Público)' })
  public async insertUser(@Body() user: CreateUserDto): Promise<any> {
    // Aquí el servicio debe validar si el username ya existe (Requisito: Mejora validación)
    return await this.userSvc.insertUser(user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario (Admin o dueño)' })
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
    @Req() request: any,
  ): Promise<any> {
    const currentUser = request['user'];
    // Solo el Admin o el mismo usuario pueden editar
    if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
      throw new HttpException('No tienes permisos para editar otros usuarios', HttpStatus.FORBIDDEN);
    }
    return await this.userSvc.updateUser(id, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN) 
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any 
  ): Promise<boolean> {
    try {
      // 1. Aquí extraes el ID. Si TypeScript te obliga a usar ID, déjalo así:
      const adminId = req.user.ID || req.user.id || req.user.sub; 

      // 2. USA la variable adminId que acabas de crear
      await this.userSvc.deleteUser(id, adminId);
      
      return true;
    } catch (error: any) {
      throw new HttpException(
        error.message || `Error al eliminar usuario`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}