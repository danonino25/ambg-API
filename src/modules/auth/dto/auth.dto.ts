import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  password: string;
}