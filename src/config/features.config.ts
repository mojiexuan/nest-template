/**
 * 功能开关配置
 * 根据环境变量判断哪些功能模块启用
 */

/**
 * 检查数据库是否配置
 */
export function isDatabaseEnabled(): boolean {
  return Boolean(process.env.DB_HOST);
}

/**
 * 检查 Redis 是否配置
 */
export function isRedisEnabled(): boolean {
  return Boolean(process.env.REDIS_HOST);
}

/**
 * 检查 JWT 认证是否配置
 */
export function isAuthEnabled(): boolean {
  return Boolean(process.env.JWT_SECRET);
}

/**
 * 检查邮件服务是否配置
 */
export function isEmailEnabled(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

/**
 * 获取功能状态摘要
 */
export function getFeatureStatus() {
  return {
    database: isDatabaseEnabled(),
    redis: isRedisEnabled(),
    auth: isAuthEnabled(),
    email: isEmailEnabled(),
  };
}
