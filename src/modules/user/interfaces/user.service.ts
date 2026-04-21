import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

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
        password: false,
        hash: false,
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
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        password: false,
        hash: false,
        create_at: true,
      },
    });
    return user as User | null;
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
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
    const hashedPassword = await this.utilService.hash(user.password);

    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    return newUser;
  }

  public async updateUser(
    id: number,
    userUpdated: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: userUpdated,
    });
    return user;
  }

  public async deleteUser(id: number): Promise<User> {
  // 🔍 1. Verificar que el usuario exista
  const userExists = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!userExists) {
    throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
  }

  // 🔍 2. Validar tareas pendientes
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
    // 🧹 3. Eliminar tareas primero
    await this.prisma.task.deleteMany({
      where: {
        userId: id,
      },
    });

    // 🗑️ 4. Eliminar usuario
    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return deletedUser as User;

  } catch (error) {
    console.error('Error en deleteUser:', error);

    throw new HttpException(
      'Error al eliminar el usuario',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}