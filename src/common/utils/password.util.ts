import * as bcrypt from 'bcryptjs';

/**
 * 密码工具类
 * 提供密码加密和验证功能
 */
export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * 加密密码
   * @param password - 明文密码
   * @returns 加密后的密码
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 验证密码
   * @param password - 明文密码
   * @param hash - 加密后的密码
   * @returns 是否匹配
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
