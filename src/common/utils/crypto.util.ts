import * as crypto from 'crypto';

/**
 * 加密工具类
 * 提供数据加密和哈希相关的通用方法
 */
export class CryptoUtil {
  /**
   * 生成MD5哈希
   * @param data - 要哈希的数据
   * @returns MD5哈希值
   */
  static md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * 生成SHA256哈希
   * @param data - 要哈希的数据
   * @returns SHA256哈希值
   */
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * 生成随机字符串
   * @param length - 字符串长度
   * @returns 随机字符串
   */
  static randomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
