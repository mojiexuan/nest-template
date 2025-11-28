import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 发送邮件DTO
 */
export class SendEmailDto {
  /**
   * 收件人邮箱地址
   */
  @IsEmail({}, { message: '收件人邮箱格式不正确' })
  @IsNotEmpty({ message: '收件人邮箱不能为空' })
  to: string;

  /**
   * 邮件主题
   */
  @IsString({ message: '邮件主题必须是字符串' })
  @IsNotEmpty({ message: '邮件主题不能为空' })
  subject: string;

  /**
   * 邮件HTML内容
   */
  @IsString({ message: '邮件内容必须是字符串' })
  @IsNotEmpty({ message: '邮件内容不能为空' })
  html: string;

  /**
   * 邮件纯文本内容（可选）
   */
  @IsString({ message: '邮件文本内容必须是字符串' })
  @IsOptional()
  text?: string;

  /**
   * 抄送地址（可选）
   */
  @IsEmail({}, { message: '抄送邮箱格式不正确' })
  @IsOptional()
  cc?: string;

  /**
   * 密送地址（可选）
   */
  @IsEmail({}, { message: '密送邮箱格式不正确' })
  @IsOptional()
  bcc?: string;
}
