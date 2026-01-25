import { IsString, MinLength } from 'class-validator';
import { ApiModel, ApiSchema, DataType } from 'docupress-api';

/**
 * 登录DTO
 * 用于验证登录请求参数
 */
@ApiModel({ description: '登录参数' })
export class LoginDto {
  @ApiSchema({ type: DataType.STRING, description: '用户名或邮箱', required: true, example: 'admin' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(1, { message: '用户名不能为空' })
  username: string;

  @ApiSchema({ type: DataType.STRING, description: '密码', required: true, example: '123456' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(1, { message: '密码不能为空' })
  password: string;
}
