/**
 * 应用配置接口
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * 应用配置对象
 * 根据环境变量配置应用基础参数
 */
export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '13000', 10),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
