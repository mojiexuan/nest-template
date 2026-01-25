import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiModel, ApiSchema, DataType } from 'docupress-api';

/**
 * 分页查询DTO
 * 用于接收和验证分页参数
 */
@ApiModel({ description: '分页参数' })
export class PaginationDto {
  @ApiSchema({ type: DataType.INTEGER, description: '页码', example: '1' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  page?: number = 1;

  @ApiSchema({ type: DataType.INTEGER, description: '每页数量', example: '10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为1' })
  @Max(100, { message: '每页数量最大为100' })
  pageSize?: number = 10;
}
