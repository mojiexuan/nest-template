import { requireEnv, rejectDefaultValue, requireMinLength } from './config-validator';

/**
 * JWT配置接口
 */
export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

/**
 * 验证JWT配置
 * 确保必需的环境变量已设置
 */
function validateJwtConfig(): void {
  // 必须设置 JWT_SECRET
  requireEnv(
    'JWT_SECRET',
    '❌ 配置错误: JWT_SECRET 未设置!\n' +
      '请在 .env 文件中配置 JWT_SECRET 环境变量。\n' +
      '示例: JWT_SECRET=your-secret-key-here',
  );

  // 不能使用默认值
  rejectDefaultValue('JWT_SECRET', ['default-secret-change-me', 'your-secret-key-change-in-production']);

  // 生产环境检查密钥长度
  if (process.env.NODE_ENV === 'production') {
    requireMinLength('JWT_SECRET', 32);
  }
}

/**
 * 获取JWT配置
 * 在首次访问时验证并返回配置
 */
function getJwtConfig(): JwtConfig {
  validateJwtConfig();
  return {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  };
}

let _jwtConfig: JwtConfig | null = null;

/**
 * JWT配置对象
 * 使用惰性加载，确保在ConfigModule加载后才验证
 */
export const jwtConfig: JwtConfig = new Proxy({} as JwtConfig, {
  get(target, prop) {
    if (!_jwtConfig) {
      _jwtConfig = getJwtConfig();
    }
    return _jwtConfig[prop as keyof JwtConfig];
  },
});
