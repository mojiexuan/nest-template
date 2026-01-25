import { isAuthEnabled } from './features.config';

/**
 * JWT配置接口
 */
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  enabled: boolean;
}

/**
 * 获取JWT配置
 */
function getJwtConfig(): JwtConfig {
  const enabled = isAuthEnabled();

  if (!enabled) {
    // 未配置时使用默认值（仅用于开发演示）
    return {
      secret: 'demo-secret-key-not-for-production',
      expiresIn: '7d',
      enabled: false,
    };
  }

  // 生产环境检查密钥长度
  const secret = process.env.JWT_SECRET ?? '';
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('❌ 生产环境 JWT_SECRET 长度至少需要 32 位');
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    enabled: true,
  };
}

let _jwtConfig: JwtConfig | null = null;

/**
 * JWT配置对象
 * 使用惰性加载，确保在ConfigModule加载后才验证
 */
export const jwtConfig: JwtConfig = new Proxy({} as JwtConfig, {
  get(target, prop) {
    _jwtConfig ??= getJwtConfig();
    return _jwtConfig[prop as keyof JwtConfig];
  },
});
