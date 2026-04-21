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
import { User } from '../entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../common/guards/auth.guard';

@ApiTags('Usuarios')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtiene una lista de todos los usuarios' })
  public async getUsers(@Req() request: any): Promise<any[]> {
    var { id } = request['user'];

    return await this.userSvc.getUsers(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    const user = await this.userSvc.getUserById(id);

    if (user) return user;
    else throw new HttpException(`Usuario no encontrado`, 404);
  }

  @UseGuards(AuthGuard)
  @Get('/get-user-by-username/:username')
  public async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | null> {
    const user = await this.userSvc.getUserByUsername(username);

    if (user) return user;
    else throw new HttpException(`Usuario no encontrado`, 404);
  }

  @Get('/check-username/:username')
  @ApiOperation({ summary: 'Verifica si un username ya existe (Público)' })
  public async checkUsername(@Param('username') username: string): Promise<{ available: boolean }> {
    const user = await this.userSvc.getUserByUsername(username);
    return { available: !user };
  }

  @Post('/insert-user')
  @ApiOperation({ summary: 'Crea un nuevo usuario (Público)' })
  public async insertUser(@Body() user: CreateUserDto): Promise<any> {
    return await this.userSvc.insertUser(user);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
    @Req() request: any,
  ): Promise<any> {
    const currentUser = request['user'];
    if (currentUser.id !== id) {
      throw new HttpException(
        'No tienes permisos para editar otros usuarios',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.userSvc.updateUser(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
  ): Promise<boolean> {
    const currentUser = request['user'];
    if (currentUser.id !== id) {
      throw new HttpException(
        'No tienes permisos para eliminar otros usuarios',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.userSvc.deleteUser(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || `Error al eliminar usuario`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}