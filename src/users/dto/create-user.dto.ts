import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string; 

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
