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
 * 获取应用配置
 */
function getAppConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  return {
    nodeEnv,
    port: parseInt(process.env.PORT ?? '13000', 10),
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
  };
}

let _appConfig: AppConfig | null = null;

/**
 * 应用配置对象
 * 使用惰性加载，确保在ConfigModule加载后才读取环境变量
 */
export const appConfig: AppConfig = new Proxy({} as AppConfig, {
  get(target, prop) {
    if (!_appConfig) {
      _appConfig = getAppConfig();
    }
    return _appConfig[prop as keyof AppConfig];
  },
});
