import { IsEnum, IsOptional, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiModel, ApiSchema, DataType } from 'docupress-api';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';

/**
 * 更新用户DTO
 * 所有字段均为可选
 */
@ApiModel({ description: '更新用户参数' })
export class UpdateUserDto {
  @ApiSchema({ type: DataType.STRING, description: '用户名', example: 'john_doe' })
  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(50, { message: '用户名长度不能超过50个字符' })
  username?: string;

  @ApiSchema({ type: DataType.STRING, description: '邮箱', format: 'email', example: 'john@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiSchema({ type: DataType.STRING, description: '密码', example: '123456' })
  @IsOptional()
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @MaxLength(20, { message: '密码长度不能超过20个字符' })
  password?: string;

  @ApiSchema({ type: DataType.STRING, description: '昵称', example: 'John' })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(100, { message: '昵称长度不能超过100个字符' })
  nickname?: string;

  @ApiSchema({ type: DataType.STRING, description: '微信OpenID' })
  @IsOptional()
  @IsString({ message: 'OpenID必须是字符串' })
  @MaxLength(100, { message: 'OpenID长度不能超过100个字符' })
  openid?: string;

  @ApiSchema({ type: DataType.STRING, description: '用户类型', example: 'student' })
  @IsOptional()
  @IsEnum(UserType, { message: '用户类型必须是 student 或 teacher' })
  userType?: UserType;

  @ApiSchema({ type: DataType.INTEGER, description: '用户状态' })
  @IsOptional()
  @IsEnum(UserStatus, { message: '用户状态值不合法' })
  status?: UserStatus;
}
