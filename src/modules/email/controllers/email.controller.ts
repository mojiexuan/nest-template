import { Body, Controller, Post } from '@nestjs/common';
import { ApiTag, ApiOperation, HttpMethod } from 'docupress-api';
import { SendEmailDto, SendVerificationDto, SendWelcomeDto, SendResetPasswordDto } from '../dto/send-email.dto';
import { EmailService } from '../email.service';

/**
 * 邮件控制器（示例）
 * 提供邮件发送的HTTP接口
 */
@ApiTag({ name: '邮件', description: '邮件发送服务' })
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/email/send',
    summary: '发送自定义邮件',
    body: SendEmailDto,
  })
  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto);
    return {
      success: true,
      message: '邮件发送成功',
    };
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/email/send-verification',
    summary: '发送验证码邮件',
    body: SendVerificationDto,
  })
  @Post('send-verification')
  async sendVerification(@Body() body: SendVerificationDto) {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.emailService.sendVerificationCode(body.email, code, body.expiresInMinutes);

    return {
      success: true,
      message: '验证码已发送',
      data: { code }, // 在实际应用中，不应该返回验证码
    };
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/email/send-welcome',
    summary: '发送欢迎邮件',
    body: SendWelcomeDto,
  })
  @Post('send-welcome')
  async sendWelcome(@Body() body: SendWelcomeDto) {
    await this.emailService.sendWelcomeEmail(body.email, body.username);

    return {
      success: true,
      message: '欢迎邮件已发送',
    };
  }

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/email/send-reset-password',
    summary: '发送密码重置邮件',
    body: SendResetPasswordDto,
  })
  @Post('send-reset-password')
  async sendResetPassword(@Body() body: SendResetPasswordDto) {
    await this.emailService.sendPasswordResetEmail(body.email, body.resetToken, body.resetUrl);

    return {
      success: true,
      message: '密码重置邮件已发送',
    };
  }
}
