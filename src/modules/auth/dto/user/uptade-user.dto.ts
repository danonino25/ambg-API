import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, {
        message: 'Debe tener al menos 3 caracteres'
    })
    @MaxLength(150)
    name?: string;

     @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, {
        message: 'Debe tener al menos 3 caracteres'
    })
    @MaxLength(150)
    lastname?: string;

     @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, {
        message: 'Debe tener al menos 3 caracteres'
    })
    @MaxLength(150)
    username?: string;

     @IsString({ message: 'Debe ser una cadena' })
    @MinLength(8, {
        message: 'Debe tener al menos 8 caracteres'
    })
    @MaxLength(25)
    password?: string;
}