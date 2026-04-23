import { HttpException, HttpStatus, Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private utilService: UtilService,
  ) {}

  public async getUsers(id: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        create_at: true,
      },
      where: {
        id: {
          not: id,
        },
      },
    });
    return users;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        create_at: true,
      },
    });
    return user as User | null;
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        password: false,
        create_at: true,
      },
    });
    return user as User | null;
  }

  public async insertUser(user: CreateUserDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: user.username }
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const hashedPassword = await this.utilService.hash(user.password);

    const newUser = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    await (this.prisma as any).logs.create({
      data: {
        action: 'CREATE_USER',
        description: `Usuario ${newUser.username} registrado`,
        session_id: newUser.id,
        statusCode: 201
      }
    });

    return newUser;
  }

  public async updateUser(id: number, userUpdated: UpdateUserDto, adminId?: number): Promise<User> {
    const oldUser = await this.prisma.user.findUnique({ where: { id } });

    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdated,
    });

    await (this.prisma as any).logs.create({
      data: {
        action: 'UPDATE_USER',
        description: `Actualización de datos. ${oldUser?.role !== user.role ? 'CAMBIO DE ROL' : ''}`,
        session_id: adminId || id,
        statusCode: 200
      }
    });

    return user;
  }

  public async deleteUser(id: number, adminId: number): Promise<User> {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const pendingTaskCount = await this.prisma.task.count({
      where: {
        userId: id,
        completed: false,
      },
    });

    if (pendingTaskCount > 0) {
      throw new HttpException(
        'No es posible eliminar tu cuenta hasta que hayas completado todas tus tareas',
        HttpStatus.CONFLICT,
      );
    }

    try {
      // 🧹 Eliminar tareas primero
      await this.prisma.task.deleteMany({
        where: { userId: id },
      });

      // 🗑️ Eliminar usuario
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      // Auditoría
      await (this.prisma as any).logs.create({
        data: {
          action: 'DELETE_USER',
          description: `Usuario ${deletedUser.username} eliminado del sistema`,
          session_id: adminId,
          statusCode: 200
        }
      });

      return deletedUser as User;

    } catch (error) {
      throw new HttpException(
        'Error al eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}