/**
 * 用户状态枚举
 */
export enum UserStatus {
  /**
   * 正常
   */
  NORMAL = 1,

  /**
   * 封禁
   */
  BANNED = -1,

  /**
   * 待审核
   */
  PENDING = 0,
}
