import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '../enums/user-type.enum';

/**
 * 创建用户DTO
 * 用于验证创建用户请求参数
 */
export class CreateUserDto {
  /**
   * 用户名
   */
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(50, { message: '用户名长度不能超过50个字符' })
  username: string;

  /**
   * 邮箱
   */
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  /**
   * 密码
   */
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @MaxLength(20, { message: '密码长度不能超过20个字符' })
  password: string;

  /**
   * 昵称（可选）
   */
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(100, { message: '昵称长度不能超过100个字符' })
  nickname?: string;

  /**
   * 微信OpenID（可选）
   */
  @IsOptional()
  @IsString({ message: 'OpenID必须是字符串' })
  @MaxLength(100, { message: 'OpenID长度不能超过100个字符' })
  openid?: string;

  /**
   * 用户类型（可选，默认为学生）
   */
  @IsOptional()
  @IsEnum(UserType, { message: '用户类型必须是 student 或 teacher' })
  userType?: UserType;
}
