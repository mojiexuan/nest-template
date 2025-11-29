import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { requireEnvInProduction, warnIfNotSet } from './config-validator';

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
}

/**
 * 验证数据库配置
 * 确保生产环境配置了密码
 */
function validateDatabaseConfig(): void {
  // 生产环境必须设置密码
  requireEnvInProduction(
    'DB_PASSWORD',
    '❌ 配置错误: 生产环境必须设置 DB_PASSWORD!\n' + '请在 .env 文件中配置数据库密码。',
  );

  // 警告未设置数据库名
  warnIfNotSet('DB_DATABASE', 'chenille');
}

/**
 * 获取数据库配置
 */
function getDatabaseConfig(): DatabaseConfig {
  validateDatabaseConfig();
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '15432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_DATABASE ?? 'chenille',
  };
}

let _databaseConfig: DatabaseConfig | null = null;

/**
 * 数据库配置对象
 * 使用惰性加载，确保在ConfigModule加载后才验证
 */
export const databaseConfig: DatabaseConfig = new Proxy({} as DatabaseConfig, {
  get(target, prop) {
    if (!_databaseConfig) {
      _databaseConfig = getDatabaseConfig();
    }
    return _databaseConfig[prop as keyof DatabaseConfig];
  },
});

/**
 * 获取TypeORM配置
 * @param isDevelopment - 是否为开发环境
 * @returns TypeORM模块配置选项
 */
export const getTypeOrmConfig = (isDevelopment: boolean): TypeOrmModuleOptions => ({
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  autoLoadEntities: true,
  synchronize: isDevelopment,
  logging: isDevelopment,
});
