import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Redis模块
 * 全局模块，提供Redis服务
 */
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
