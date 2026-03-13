import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { appConfig, getFeatureStatus } from '@config';
import { validateEnv } from '@config/env.schema';
import { AppModule } from './app.module';

/**
 * 应用程序启动函数
 * 创建并配置NestJS应用实例
 */
async function bootstrap() {
  // 校验环境变量
  validateEnv();

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Helmet 安全头
  app.use(
    helmet({
      contentSecurityPolicy: appConfig.isProduction ? undefined : false,
    }),
  );

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 启用CORS
  app.enableCors({
    origin: appConfig.isProduction ? process.env.CORS_ORIGIN?.split(',') : true,
    credentials: true,
  });

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // Swagger API 文档（仅开发环境）
  if (appConfig.isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Chenille Server API')
      .setDescription('企业级 NestJS 项目模板 API 文档')
      .setVersion('1.0.0')
      .addServer('http://localhost:13000', '开发环境')
      .addServer('https://api.example.com', '生产环境')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '请输入 JWT Token',
        },
        'JWT',
      )
      .setContact('Chenille Team', '', 'team@example.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(appConfig.port);

  // 打印启动信息
  const features = getFeatureStatus();
  logger.log(`🚀 应用已启动: http://localhost:${appConfig.port}/api`);
  if (appConfig.isDevelopment) {
    logger.log(`📚 API文档: http://localhost:${appConfig.port}/api-docs`);
  }
  logger.log(`🔌 WebSocket: ws://localhost:${appConfig.port}/ws`);
  logger.log(`📦 功能状态:`);
  logger.log(`   - 数据库: ${features.database ? '✅ PostgreSQL' : '⚡ 未配置'}`);
  logger.log(`   - 缓存: ${features.redis ? '✅ Redis' : '⚡ 内存存储'}`);
  logger.log(`   - 认证: ${features.auth ? '✅ JWT' : '⚠️ 演示模式'}`);
  logger.log(`   - 邮件: ${features.email ? '✅ SMTP' : '⏸️ 未配置'}`);
}

void bootstrap();
