import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisOptions } from '@config';

/**
 * Redis服务
 * 提供Redis操作的封装方法
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    // 使用统一的Redis配置
    this.client = new Redis(getRedisOptions());
  }

  /**
   * 获取Redis客户端实例
   * @returns Redis客户端
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * 设置键值对
   * @param key - 键
   * @param value - 值
   * @param ttl - 过期时间（秒），可选
   * @returns 操作结果
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  /**
   * 获取值
   * @param key - 键
   * @returns 值，不存在返回null
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * 删除键
   * @param key - 键
   * @returns 删除的数量
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * 检查键是否存在
   * @param key - 键
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * 设置过期时间
   * @param key - 键
   * @param seconds - 秒数
   * @returns 操作结果
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /**
   * 获取剩余过期时间
   * @param key - 键
   * @returns 剩余秒数，-1表示永不过期，-2表示不存在
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * 模块销毁时断开连接
   */
  onModuleDestroy() {
    this.client.disconnect();
  }
}
