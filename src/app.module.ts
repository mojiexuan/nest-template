import { MiddlewareConsumer, Module, NestModule, type DynamicModule, type Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { XssMiddleware } from '@common/middleware/xss.middleware';
import { appConfig, getTypeOrmConfig, isDatabaseEnabled } from '@config';
import { loggerConfig } from '@config/logger.config';
import { AuthModule } from '@modules/auth/auth.module';
import { HealthModule } from '@modules/health/health.module';
import { RedisModule } from '@modules/redis/redis.module';
import { TaskModule } from '@modules/task/task.module';
import { UploadModule } from '@modules/upload/upload.module';
import { UserModule } from '@modules/user/user.module';
import { WebsocketModule } from '@modules/websocket/websocket.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * 构建动态导入模块列表
 */
function buildImports(): Array<Type | DynamicModule | Promise<DynamicModule>> {
  const imports: Array<Type | DynamicModule | Promise<DynamicModule>> = [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),

    // 日志模块
    WinstonModule.forRoot(loggerConfig),

    // 限流模块 - 每分钟最多60次请求
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    }),

    // Redis模块（全局，支持降级到内存存储）
    RedisModule,

    // 定时任务模块
    TaskModule,

    // 健康检查模块
    HealthModule,

    // 文件上传模块
    UploadModule,

    // WebSocket 模块
    WebsocketModule,
  ];

  // 数据库模块（可选）
  if (isDatabaseEnabled()) {
    const typeOrmConfig = getTypeOrmConfig(appConfig.isDevelopment);
    if (typeOrmConfig) {
      imports.push(
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: () => typeOrmConfig,
        }),
      );
      // 依赖数据库的模块
      imports.push(AuthModule);
      imports.push(UserModule);
    }
  }

  return imports;
}

/**
 * 应用程序根模块
 * 负责导入和配置所有功能模块
 * 根据环境变量动态加载可选模块
 */
@Module({
  imports: buildImports(),
  controllers: [AppController],
  providers: [
    AppService,
    // 全局JWT认证守卫（仅在认证启用时生效）
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局限流守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // XSS 防护中间件
    consumer.apply(XssMiddleware).forRoutes('*path');
  }
}
