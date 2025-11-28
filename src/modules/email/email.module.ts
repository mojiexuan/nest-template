import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * 邮件模块
 * 提供邮件发送服务
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
