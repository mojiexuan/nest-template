/**
 * 配置验证工具
 * 用于验证必需的环境变量
 */

/**
 * 验证必需的环境变量
 * @param key - 环境变量名
 * @param message - 自定义错误消息（可选）
 */
export function requireEnv(key: string, message?: string): string {
  const value = process.env[key];

  if (!value) {
    const errorMessage = message || `❌ 配置错误: ${key} 未设置!\n` + `请在 .env 文件中配置 ${key} 环境变量。`;

    throw new Error(errorMessage);
  }

  return value;
}

/**
 * 验证环境变量不是默认值
 * @param key - 环境变量名
 * @param defaultValues - 不允许的默认值列表
 */
export function rejectDefaultValue(key: string, defaultValues: string[]): void {
  const value = process.env[key];

  if (value && defaultValues.includes(value)) {
    throw new Error(
      `❌ 配置错误: ${key} 使用了默认值!\n` + `请修改 .env 文件中的 ${key} 为安全的值。\n` + `当前值: ${value}`,
    );
  }
}

/**
 * 验证字符串最小长度
 * @param key - 环境变量名
 * @param minLength - 最小长度
 */
export function requireMinLength(key: string, minLength: number): void {
  const value = process.env[key];

  if (value && value.length < minLength) {
    throw new Error(
      `❌ 配置错误: ${key} 长度不足!\n` + `最少需要 ${minLength} 个字符，当前只有 ${value.length} 个字符。`,
    );
  }
}

/**
 * 仅在生产环境验证必需的环境变量
 * @param key - 环境变量名
 * @param message - 自定义错误消息（可选）
 */
export function requireEnvInProduction(key: string, message?: string): void {
  if (process.env.NODE_ENV === 'production') {
    requireEnv(key, message);
  }
}

/**
 * 警告环境变量未设置
 * @param key - 环境变量名
 * @param defaultValue - 默认值
 */
export function warnIfNotSet(key: string, defaultValue: string): void {
  if (!process.env[key]) {
    console.warn(`⚠️  警告: ${key} 未设置，使用默认值 "${defaultValue}"`);
  }
}
