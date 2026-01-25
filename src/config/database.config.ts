import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isDatabaseEnabled } from './features.config';

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  enabled: boolean;
  type: 'postgres';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

/**
 * 获取数据库配置
 */
function getDatabaseConfig(): DatabaseConfig {
  const enabled = isDatabaseEnabled();

  return {
    enabled,
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD,
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
    _databaseConfig ??= getDatabaseConfig();
    return _databaseConfig[prop as keyof DatabaseConfig];
  },
});

/**
 * 获取TypeORM配置
 * @param isDevelopment - 是否为开发环境
 * @returns TypeORM模块配置选项，未配置数据库时返回 null
 */
export const getTypeOrmConfig = (isDevelopment: boolean): TypeOrmModuleOptions | null => {
  if (!isDatabaseEnabled()) {
    return null;
  }

  return {
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    autoLoadEntities: true,
    synchronize: isDevelopment,
    logging: isDevelopment,
  };
};
