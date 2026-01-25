import { PasswordUtil } from './password.util';

describe('PasswordUtil', () => {
  const plainPassword = 'testPassword123';

  describe('hash', () => {
    it('应该返回哈希后的密码', async () => {
      const hashedPassword = await PasswordUtil.hash(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('相同密码每次哈希结果应不同（因为盐值不同）', async () => {
      const hash1 = await PasswordUtil.hash(plainPassword);
      const hash2 = await PasswordUtil.hash(plainPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('正确密码应返回 true', async () => {
      const hashedPassword = await PasswordUtil.hash(plainPassword);
      const isMatch = await PasswordUtil.compare(plainPassword, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('错误密码应返回 false', async () => {
      const hashedPassword = await PasswordUtil.hash(plainPassword);
      const isMatch = await PasswordUtil.compare('wrongPassword', hashedPassword);

      expect(isMatch).toBe(false);
    });
  });
});
