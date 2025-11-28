import { IsString, MinLength } from 'class-validator';

/**
 * 登录DTO
 * 用于验证登录请求参数
 */
export class LoginDto {
  /**
   * 用户名或邮箱
   */
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(1, { message: '用户名不能为空' })
  username: string;

  /**
   * 密码
   */
  @IsString({ message: '密码必须是字符串' })
  @MinLength(1, { message: '密码不能为空' })
  password: string;
}
