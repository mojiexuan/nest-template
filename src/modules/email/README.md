# Email 模块使用指南

## 概述

Email 模块提供了完整的邮件发送功能，基于 Nodemailer 实现，支持 SMTP 协议。

## 配置

### 环境变量

在 `.env` 文件中配置以下环境变量：

```env
# 邮件配置
EMAIL_SMTP_HOST="smtp.exmail.qq.com"
EMAIL_SMTP_PORT="465"
EMAIL_SMTP_SECURE="true"
EMAIL_SMTP_USER="system@chenjiabao.com"
EMAIL_SMTP_PASS="your-password"
EMAIL_FROM_EMAIL="system@chenjiabao.com"
EMAIL_FROM_NAME="智道AI"
```

### 导入模块

在需要使用邮件服务的模块中导入 `EmailModule`：

```typescript
import { Module } from '@nestjs/common';
import { EmailModule } from '@modules/email';

@Module({
  imports: [EmailModule],
})
export class YourModule {}
```

## 使用方法

### 1. 注入服务

在您的服务或控制器中注入 `EmailService`：

```typescript
import { Injectable } from '@nestjs/common';
import { EmailService } from '@modules/email';

@Injectable()
export class YourService {
  constructor(private readonly emailService: EmailService) {}
}
```

### 2. 发送普通邮件

```typescript
await this.emailService.sendEmail({
  to: 'user@example.com',
  subject: '邮件主题',
  html: '<h1>这是邮件内容</h1><p>支持HTML格式</p>',
  text: '这是纯文本内容（可选）',
});
```

### 3. 发送验证码邮件

```typescript
await this.emailService.sendVerificationCode(
  'user@example.com',
  '123456',
  5, // 验证码有效期（分钟），默认5分钟
);
```

### 4. 发送欢迎邮件

```typescript
await this.emailService.sendWelcomeEmail('user@example.com', '用户名');
```

### 5. 发送密码重置邮件

```typescript
await this.emailService.sendPasswordResetEmail(
  'user@example.com',
  'reset-token-here',
  'https://yoursite.com/reset-password?token=reset-token-here',
);
```

## API 文档

### EmailService 方法

#### sendEmail(sendEmailDto: SendEmailDto): Promise<boolean>

发送自定义邮件。

**参数：**

- `sendEmailDto.to`: 收件人邮箱地址（必填）
- `sendEmailDto.subject`: 邮件主题（必填）
- `sendEmailDto.html`: 邮件HTML内容（必填）
- `sendEmailDto.text`: 邮件纯文本内容（可选）
- `sendEmailDto.cc`: 抄送地址（可选）
- `sendEmailDto.bcc`: 密送地址（可选）

**返回：**

- `Promise<boolean>`: 发送成功返回 true

#### sendVerificationCode(to: string, code: string, expiresInMinutes?: number): Promise<boolean>

发送验证码邮件。

**参数：**

- `to`: 收件人邮箱地址
- `code`: 验证码
- `expiresInMinutes`: 验证码有效期（分钟），默认5分钟

**返回：**

- `Promise<boolean>`: 发送成功返回 true

#### sendWelcomeEmail(to: string, username: string): Promise<boolean>

发送欢迎邮件。

**参数：**

- `to`: 收件人邮箱地址
- `username`: 用户名

**返回：**

- `Promise<boolean>`: 发送成功返回 true

#### sendPasswordResetEmail(to: string, resetToken: string, resetUrl: string): Promise<boolean>

发送密码重置邮件。

**参数：**

- `to`: 收件人邮箱地址
- `resetToken`: 重置令牌
- `resetUrl`: 重置链接

**返回：**

- `Promise<boolean>`: 发送成功返回 true

## 示例：在控制器中使用

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '@modules/email';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-verification')
  async sendVerification(@Body() body: { email: string }) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailService.sendVerificationCode(body.email, code);
    return { message: '验证码已发送' };
  }
}
```

## 注意事项

1. **SMTP 配置**：确保 SMTP 服务器配置正确，包括主机、端口、认证信息等。
2. **SSL/TLS**：如果使用 465 端口，通常需要启用 `EMAIL_SMTP_SECURE=true`。
3. **错误处理**：所有邮件发送方法都会抛出异常，请妥善处理错误。
4. **日志记录**：EmailService 会自动记录发送成功和失败的日志。
5. **邮件模板**：内置的邮件模板已经过优化，支持响应式设计。

## 扩展

如需自定义邮件模板，可以参考 `sendVerificationCode`、`sendWelcomeEmail` 和 `sendPasswordResetEmail` 方法中的 HTML 模板结构。
