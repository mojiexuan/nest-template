import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import { CreateUserDto } from './create-user.dto';

/**
 * 更新用户DTO
 * 继承创建用户DTO，所有字段均为可选
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * 用户状态（可选）
   */
  @IsOptional()
  @IsEnum(UserStatus, { message: '用户状态值不合法' })
  status?: UserStatus;
}
