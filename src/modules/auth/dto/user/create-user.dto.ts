import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(150)
      name: string;
    
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(150)
      lastname: string;
    
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(150)
      username: string;
    
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(25)
      password: string;
}