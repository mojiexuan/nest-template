import type { RedisOptions } from 'ioredis';

/**
 * Redis配置接口
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

/**
 * 获取Redis配置
 */
function getRedisConfig(): RedisConfig {
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '16379', 10),
    password: process.env.REDIS_PASSWORD ?? undefined,
    db: parseInt(process.env.REDIS_DB ?? '1', 10),
  };
}

let _redisConfig: RedisConfig | null = null;

/**
 * Redis配置对象
 * 使用惰性加载，确保在ConfigModule加载后才读取环境变量
 */
export const redisConfig: RedisConfig = new Proxy({} as RedisConfig, {
  get(target, prop) {
    _redisConfig ??= getRedisConfig();
    return _redisConfig[prop as keyof RedisConfig];
  },
});

/**
 * 获取Redis客户端配置
 * @returns Redis连接配置选项
 */
export const getRedisOptions = (): RedisOptions => ({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  db: redisConfig.db,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
