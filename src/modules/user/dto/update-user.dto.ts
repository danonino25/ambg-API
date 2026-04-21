import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser un string' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(150)
  lastname?: string;

  @IsOptional()
  @IsString({ message: 'El username debe ser un string' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(150)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}