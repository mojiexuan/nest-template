import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

/**
 * 发送邮件DTO
 */
export class SendEmailDto {
  @ApiProperty({ description: '收件人邮箱地址', format: 'email', example: 'user@example.com' })
  @IsEmail({}, { message: '收件人邮箱格式不正确' })
  @IsNotEmpty({ message: '收件人邮箱不能为空' })
  to: string;

  @ApiProperty({ description: '邮件主题', example: '欢迎注册' })
  @IsString({ message: '邮件主题必须是字符串' })
  @IsNotEmpty({ message: '邮件主题不能为空' })
  subject: string;

  @ApiProperty({ description: '邮件HTML内容', example: '<h1>Hello</h1>' })
  @IsString({ message: '邮件内容必须是字符串' })
  @IsNotEmpty({ message: '邮件内容不能为空' })
  html: string;

  @ApiProperty({ description: '邮件纯文本内容', required: false })
  @IsString({ message: '邮件文本内容必须是字符串' })
  @IsOptional()
  text?: string;

  @ApiProperty({ description: '抄送地址', format: 'email', example: 'cc@example.com', required: false })
  @IsEmail({}, { message: '抄送邮箱格式不正确' })
  @IsOptional()
  cc?: string;

  @ApiProperty({ description: '密送地址', format: 'email', example: 'bcc@example.com', required: false })
  @IsEmail({}, { message: '密送邮箱格式不正确' })
  @IsOptional()
  bcc?: string;
}

/**
 * 发送验证码DTO
 */
export class SendVerificationDto {
  @ApiProperty({ description: '收件人邮箱', format: 'email', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '验证码过期时间（分钟）', example: 5, required: false })
  @IsOptional()
  @IsNumber()
  expiresInMinutes?: number;
}

/**
 * 发送欢迎邮件DTO
 */
export class SendWelcomeDto {
  @ApiProperty({ description: '收件人邮箱', format: 'email', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  username: string;
}

/**
 * 发送密码重置邮件DTO
 */
export class SendResetPasswordDto {
  @ApiProperty({ description: '收件人邮箱', format: 'email', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '重置Token' })
  @IsString()
  resetToken: string;

  @ApiProperty({ description: '重置链接', example: 'https://example.com/reset' })
  @IsString()
  resetUrl: string;
}
