import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Min(4)
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
