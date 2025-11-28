import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { appConfig, getTypeOrmConfig } from '@config';
import { AuthModule } from '@modules/auth/auth.module';
import { RedisModule } from '@modules/redis/redis.module';
import { UserModule } from '@modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * 应用程序根模块
 * 负责导入和配置所有功能模块
 */
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM模块 - 使用统一配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => getTypeOrmConfig(appConfig.isDevelopment),
    }),

    // Redis模块（全局）
    RedisModule,

    // 认证模块
    AuthModule,

    // 业务模块
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局JWT认证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
