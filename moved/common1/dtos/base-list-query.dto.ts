import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { _IsInt } from '@/common/decorators';

export class BaseListQueryDto {
  @ApiProperty({
    default: 1,
    required: false,
  })
  @_IsInt()
  @IsOptional()
  page?: number;

  @ApiProperty({
    default: 20,
    required: false,
  })
  @_IsInt()
  @IsOptional()
  limit?: number;
}
