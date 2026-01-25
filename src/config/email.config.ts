import { requireEnvInProduction } from './config-validator';

/**
 * 邮件配置接口
 */
export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: {
    email: string;
    name: string;
  };
}

/**
 * 验证邮件配置
 * 确保生产环境配置了邮件服务
 */
function validateEmailConfig(): void {
  // 生产环境必须配置邮件账号和密码
  requireEnvInProduction('EMAIL_SMTP_USER', '❌ 配置错误: 生产环境必须设置 EMAIL_SMTP_USER!');
  requireEnvInProduction('EMAIL_SMTP_PASS', '❌ 配置错误: 生产环境必须设置 EMAIL_SMTP_PASS!');
  requireEnvInProduction('EMAIL_FROM_EMAIL', '❌ 配置错误: 生产环境必须设置 EMAIL_FROM_EMAIL!');
}

/**
 * 获取邮件配置
 */
function getEmailConfig(): EmailConfig {
  validateEmailConfig();
  return {
    smtp: {
      host: process.env.EMAIL_SMTP_HOST ?? 'smtp.exmail.qq.com',
      port: parseInt(process.env.EMAIL_SMTP_PORT ?? '465', 10),
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SMTP_USER ?? '',
        pass: process.env.EMAIL_SMTP_PASS ?? '',
      },
    },
    from: {
      email: process.env.EMAIL_FROM_EMAIL ?? '',
      name: process.env.EMAIL_FROM_NAME ?? '',
    },
  };
}

let _emailConfig: EmailConfig | null = null;

/**
 * 邮件配置对象
 * 使用惰性加载，确保在ConfigModule加载后才验证
 */
export const emailConfig: EmailConfig = new Proxy({} as EmailConfig, {
  get(target, prop) {
    _emailConfig ??= getEmailConfig();
    return _emailConfig[prop as keyof EmailConfig];
  },
});
