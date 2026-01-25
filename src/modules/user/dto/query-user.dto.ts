import { IsOptional, IsString } from 'class-validator';
import { ApiSchema, DataType } from 'docupress-api';
import { PaginationDto } from '@common/dto/pagination.dto';

/**
 * 查询用户DTO
 * 继承分页参数，支持按关键词搜索
 */
export class QueryUserDto extends PaginationDto {
  @ApiSchema({ type: DataType.STRING, description: '搜索关键词' })
  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  keyword?: string;
}
