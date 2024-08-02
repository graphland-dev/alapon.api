import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit: number;
}
