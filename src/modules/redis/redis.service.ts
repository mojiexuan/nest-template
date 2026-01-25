import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisOptions } from '@config';
import { isRedisEnabled } from '@config/features.config';

/**
 * Redis服务
 * 提供Redis操作的封装方法
 * 如果未配置 Redis，则使用内存存储作为降级方案
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memoryStore = new Map<string, { value: string; expireAt?: number }>();
  private readonly enabled: boolean;

  constructor() {
    this.enabled = isRedisEnabled();

    if (this.enabled) {
      this.client = new Redis({
        ...getRedisOptions(),
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          if (times > 3) {
            this.logger.warn('Redis 连接失败，降级为内存存储');
            return null; // 停止重试
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis 错误: ${err.message}，使用内存存储`);
      });

      this.client.connect().catch(() => {
        this.logger.warn('Redis 连接失败，使用内存存储');
      });
    } else {
      this.logger.log('Redis 未配置，使用内存存储');
    }
  }

  /**
   * 检查 Redis 是否可用
   */
  private isClientReady(): boolean {
    return this.client?.status === 'ready';
  }

  /**
   * 设置键值对
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (this.isClientReady() && this.client) {
      if (ttl) {
        return this.client.set(key, value, 'EX', ttl);
      }
      return this.client.set(key, value);
    }

    // 内存存储降级
    this.memoryStore.set(key, {
      value,
      expireAt: ttl ? Date.now() + ttl * 1000 : undefined,
    });
    return 'OK';
  }

  /**
   * 获取值
   */
  async get(key: string): Promise<string | null> {
    if (this.isClientReady() && this.client) {
      return this.client.get(key);
    }

    // 内存存储降级
    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expireAt && Date.now() > item.expireAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<number> {
    if (this.isClientReady() && this.client) {
      return this.client.del(key);
    }

    // 内存存储降级
    return this.memoryStore.delete(key) ? 1 : 0;
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (this.isClientReady() && this.client) {
      const result = await this.client.exists(key);
      return result === 1;
    }

    // 内存存储降级
    const item = this.memoryStore.get(key);
    if (!item) return false;
    if (item.expireAt && Date.now() > item.expireAt) {
      this.memoryStore.delete(key);
      return false;
    }
    return true;
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<number> {
    if (this.isClientReady() && this.client) {
      return this.client.expire(key, seconds);
    }

    // 内存存储降级
    const item = this.memoryStore.get(key);
    if (item) {
      item.expireAt = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }

  /**
   * 获取剩余过期时间
   */
  async ttl(key: string): Promise<number> {
    if (this.isClientReady() && this.client) {
      return this.client.ttl(key);
    }

    // 内存存储降级
    const item = this.memoryStore.get(key);
    if (!item) return -2;
    if (!item.expireAt) return -1;
    const remaining = Math.ceil((item.expireAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  /**
   * 模块销毁时断开连接
   */
  onModuleDestroy() {
    this.client?.disconnect();
  }
}
