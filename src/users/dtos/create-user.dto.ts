import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Min(4)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @Min(4)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Min(5)
  @IsNotEmpty()
  password: string;
}
