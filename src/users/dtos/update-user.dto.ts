import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
