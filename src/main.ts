import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { defineConfig, HttpHeader, render, ApiModel, ApiSchema, DataType, AuthIn } from 'docupress-api';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { appConfig, getFeatureStatus } from '@config';
import { validateEnv } from '@config/env.schema';
import { AppModule } from './app.module';

// 统一响应格式
@ApiModel({ description: '统一响应格式' })
class ResponseWrapper {
  @ApiSchema({ type: DataType.INTEGER, description: '状态码', example: '0' })
  code: number;

  @ApiSchema({ type: DataType.STRING, description: '消息', example: 'success' })
  message: string;

  @ApiSchema({ description: '数据' })
  data: unknown;
}

// 配置 API 文档
defineConfig({
  title: 'Chenille Server API',
  description: '企业级 NestJS 项目模板 API 文档',
  version: '1.0.0',
  servers: [
    { name: '开发环境', url: 'http://localhost:13000' },
    { name: '生产环境', url: 'https://api.example.com' },
  ],
  headers: [
    {
      name: HttpHeader.Authorization,
      description: 'Bearer Token (JWT)',
      required: false,
    },
  ],
  wrapper: {
    model: ResponseWrapper,
    dataField: 'data',
  },
  auth: {
    in: AuthIn.HEADER,
    field: 'Authorization',
    prefix: 'Bearer ',
    description: '登录后自动获取',
    extractFrom: {
      path: '/api/auth/login',
      field: 'data.token',
    },
  },
  author: {
    name: 'Chenille Team',
    email: 'team@example.com',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  },
});

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

  // API 文档（仅开发环境）
  if (appConfig.isDevelopment) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('/api-docs', (_req: unknown, res: { type: (t: string) => { send: (html: string) => void } }) => {
      res.type('html').send(render());
    });
  }

  await app.listen(appConfig.port);

  // 打印启动信息
  const features = getFeatureStatus();
  logger.log(`🚀 应用已启动: http://localhost:${appConfig.port}/api`);
  if (appConfig.isDevelopment) {
    logger.log(`📚 API文档: http://localhost:${appConfig.port}/api-docs`);
  }
  logger.log(`📦 功能状态:`);
  logger.log(`   - 数据库: ${features.database ? '✅ PostgreSQL' : '⚡ 未配置'}`);
  logger.log(`   - 缓存: ${features.redis ? '✅ Redis' : '⚡ 内存存储'}`);
  logger.log(`   - 认证: ${features.auth ? '✅ JWT' : '⚠️ 演示模式'}`);
  logger.log(`   - 邮件: ${features.email ? '✅ SMTP' : '⏸️ 未配置'}`);
}

void bootstrap();
