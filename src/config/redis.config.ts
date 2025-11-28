import { RedisOptions } from 'ioredis';

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
 * Redis配置对象
 * 根据环境变量配置Redis连接参数
 */
export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '16379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB ?? '1', 10),
};

/**
 * 获取Redis客户端配置
 * @returns Redis连接配置选项
 */
export const getRedisOptions = (): RedisOptions => ({
  ...redisConfig,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
