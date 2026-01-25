import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiModel, ApiSchema, DataType } from 'docupress-api';

/**
 * 发送邮件DTO
 */
@ApiModel({ description: '发送邮件参数' })
export class SendEmailDto {
  @ApiSchema({
    type: DataType.STRING,
    description: '收件人邮箱地址',
    required: true,
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '收件人邮箱格式不正确' })
  @IsNotEmpty({ message: '收件人邮箱不能为空' })
  to: string;

  @ApiSchema({ type: DataType.STRING, description: '邮件主题', required: true, example: '欢迎注册' })
  @IsString({ message: '邮件主题必须是字符串' })
  @IsNotEmpty({ message: '邮件主题不能为空' })
  subject: string;

  @ApiSchema({ type: DataType.STRING, description: '邮件HTML内容', required: true, example: '<h1>Hello</h1>' })
  @IsString({ message: '邮件内容必须是字符串' })
  @IsNotEmpty({ message: '邮件内容不能为空' })
  html: string;

  @ApiSchema({ type: DataType.STRING, description: '邮件纯文本内容' })
  @IsString({ message: '邮件文本内容必须是字符串' })
  @IsOptional()
  text?: string;

  @ApiSchema({ type: DataType.STRING, description: '抄送地址', format: 'email', example: 'cc@example.com' })
  @IsEmail({}, { message: '抄送邮箱格式不正确' })
  @IsOptional()
  cc?: string;

  @ApiSchema({ type: DataType.STRING, description: '密送地址', format: 'email', example: 'bcc@example.com' })
  @IsEmail({}, { message: '密送邮箱格式不正确' })
  @IsOptional()
  bcc?: string;
}

/**
 * 发送验证码DTO
 */
@ApiModel({ description: '发送验证码参数' })
export class SendVerificationDto {
  @ApiSchema({
    type: DataType.STRING,
    description: '收件人邮箱',
    required: true,
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiSchema({ type: DataType.INTEGER, description: '验证码过期时间（分钟）', example: '5' })
  @IsOptional()
  @IsNumber()
  expiresInMinutes?: number;
}

/**
 * 发送欢迎邮件DTO
 */
@ApiModel({ description: '发送欢迎邮件参数' })
export class SendWelcomeDto {
  @ApiSchema({
    type: DataType.STRING,
    description: '收件人邮箱',
    required: true,
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiSchema({ type: DataType.STRING, description: '用户名', required: true, example: 'john_doe' })
  @IsString()
  username: string;
}

/**
 * 发送密码重置邮件DTO
 */
@ApiModel({ description: '发送密码重置邮件参数' })
export class SendResetPasswordDto {
  @ApiSchema({
    type: DataType.STRING,
    description: '收件人邮箱',
    required: true,
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiSchema({ type: DataType.STRING, description: '重置Token', required: true })
  @IsString()
  resetToken: string;

  @ApiSchema({ type: DataType.STRING, description: '重置链接', required: true, example: 'https://example.com/reset' })
  @IsString()
  resetUrl: string;
}
