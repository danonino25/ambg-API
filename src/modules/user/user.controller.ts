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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../auth/dto/user/create-user.dto';
import { UpdateUserDto } from '../auth/dto/user/uptade-user.dto';
import { User } from '../auth/entities/user.entity';
import { UserService } from './user.service';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Req } from '@nestjs/common';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userSvc: UserService,
  private readonly utilsvc: UtilService ){ }

  /** GET http://localhost:3000/api/user */
  @Get()
  @ApiOperation({ summary: '| Lista los usuarios disponibles' })
  public async fetchUsers(@Req() request: any): Promise<any[]> {
    var { id } = request['user'];
    return await this.userSvc.getUsers(id);
  }

  /** GET http://localhost:3000/api/user/1 */
  @Get(':id')
  @ApiOperation({ summary: '| Obtiene un usuario por ID' })
  public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userSvc.getUserById(id);
    if (user) return user;
    else throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  /** POST http://localhost:3000/api/user */
  @Post()
  @ApiOperation({ summary: '| Crea un nuevo usuario' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
   

    //encripar contraseña.
    const encryptedPassword = await this.utilsvc.hashPassword(user.password);

    user.password = encryptedPassword;
     return await this.userSvc.insertUser(user);
  }

  /** PUT http://localhost:3000/api/user/1 */
  @Put(':id')
  @ApiOperation({ summary: '| Actualiza un usuario por ID' })
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userSvc.updateUser(id, user);
  }

  /** DELETE http://localhost:3000/api/user/1 */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '| Elimina un usuario por ID' })
  public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      return await this.userSvc.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        'No se puede eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}