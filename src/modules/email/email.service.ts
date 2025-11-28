import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from '@config/email.config';
import { EmailTemplateUtil } from './utils/template.util';
import type { SendEmailDto } from './dto/send-email.dto';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * 邮件服务
 * 提供邮件发送功能
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    // 创建邮件传输器
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass,
      },
    });

    // 验证连接配置
    void this.verifyConnection();
  }

  /**
   * 验证SMTP连接
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('邮件服务连接成功');
    } catch (error) {
      this.logger.error('邮件服务连接失败', error);
    }
  }

  /**
   * 发送邮件
   * @param sendEmailDto - 邮件发送参数
   * @returns 发送结果
   */
  async sendEmail(sendEmailDto: SendEmailDto): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        text: sendEmailDto.text,
        html: sendEmailDto.html,
        cc: sendEmailDto.cc,
        bcc: sendEmailDto.bcc,
      });

      this.logger.log(`邮件发送成功: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`邮件发送失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 发送验证码邮件
   * @param to - 收件人邮箱
   * @param code - 验证码
   * @param expiresInMinutes - 过期时间（分钟）
   * @returns 发送结果
   */
  async sendVerificationCode(to: string, code: string, expiresInMinutes = 5): Promise<boolean> {
    // 生成验证码数字格式
    const codeDigits = code
      .split('')
      .map((digit) => `<div class="code-digit">${digit}</div>`)
      .join('');

    // 渲染模板
    const html = EmailTemplateUtil.renderTemplate('verification-code', {
      APP_NAME: emailConfig.from.name,
      CODE_DIGITS: codeDigits,
      EXPIRES_IN_MINUTES: expiresInMinutes.toString(),
      YEAR: new Date().getFullYear().toString(),
    });

    return this.sendEmail({
      to,
      subject: `【${emailConfig.from.name}】验证码通知`,
      html,
      text: `您的验证码是：${code}，${expiresInMinutes}分钟内有效。`,
    });
  }

  /**
   * 发送欢迎邮件
   * @param to - 收件人邮箱
   * @param username - 用户名
   * @returns 发送结果
   */
  async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
    // 渲染模板
    const html = EmailTemplateUtil.renderTemplate('welcome', {
      APP_NAME: emailConfig.from.name,
      USERNAME: username,
      YEAR: new Date().getFullYear().toString(),
    });

    return this.sendEmail({
      to,
      subject: `欢迎加入${emailConfig.from.name}`,
      html,
      text: `欢迎您，${username}！感谢您注册 ${emailConfig.from.name}。`,
    });
  }

  /**
   * 发送密码重置邮件
   * @param to - 收件人邮箱
   * @param resetToken - 重置令牌
   * @param resetUrl - 重置链接
   * @returns 发送结果
   */
  async sendPasswordResetEmail(to: string, resetToken: string, resetUrl: string): Promise<boolean> {
    // 渲染模板
    const html = EmailTemplateUtil.renderTemplate('password-reset', {
      APP_NAME: emailConfig.from.name,
      RESET_URL: resetUrl,
      YEAR: new Date().getFullYear().toString(),
    });

    return this.sendEmail({
      to,
      subject: `【${emailConfig.from.name}】密码重置请求`,
      html,
      text: `请访问以下链接重置您的密码：${resetUrl}（30分钟内有效）`,
    });
  }
}
