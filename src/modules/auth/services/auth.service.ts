import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { RedisService } from '@modules/redis/redis.service';
import { User } from '@modules/user/entities/user.entity';
import { UserStatus } from '@modules/user/enums/user-status.enum';
import type { LoginDto } from '../dto/login.dto';

/**
 * 认证服务
 * 处理登录、登出、token验证等逻辑
 */
@Injectable()
export class AuthService {
  private readonly TOKEN_PREFIX = 'jwt:';
  private readonly TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7天（秒）

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 用户登录
   * @param loginDto - 登录数据传输对象
   * @returns Token和用户信息
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 查找用户
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户状态
    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('账号已被封禁');
    }

    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('账号待审核');
    }

    // 生成token
    const token = await this.generateToken(user.id);

    return {
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  }

  /**
   * 生成JWT Token并存储到Redis
   * @param userId - 用户ID
   * @returns JWT Token
   */
  async generateToken(userId: string): Promise<string> {
    // JWT payload只包含用户ID
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload);

    // 将token存储到Redis，实现有状态管理
    const key = this.getTokenKey(token);
    await this.redisService.set(key, userId, this.TOKEN_EXPIRY);

    return token;
  }

  /**
   * 验证Token是否有效
   * @param token - JWT Token
   * @returns 用户ID，无效则抛出异常
   */
  async validateToken(token: string): Promise<string> {
    try {
      // 验证JWT签名
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // 检查Redis中是否存在该token
      const key = this.getTokenKey(token);
      const cachedUserId = await this.redisService.get(key);

      if (!cachedUserId || cachedUserId !== userId) {
        throw new UnauthorizedException('Token已失效');
      }

      return userId;
    } catch {
      throw new UnauthorizedException('Token无效或已过期');
    }
  }

  /**
   * 用户登出
   * @param token - JWT Token
   */
  async logout(token: string): Promise<void> {
    const key = this.getTokenKey(token);
    await this.redisService.del(key);
  }

  /**
   * 刷新Token
   * @param oldToken - 旧Token
   * @returns 新Token
   */
  async refreshToken(oldToken: string): Promise<string> {
    // 验证旧token
    const userId = await this.validateToken(oldToken);

    // 删除旧token
    await this.logout(oldToken);

    // 生成新token
    return this.generateToken(userId);
  }

  /**
   * 获取Token在Redis中的键
   * @param token - JWT Token
   * @returns Redis键
   */
  private getTokenKey(token: string): string {
    return `${this.TOKEN_PREFIX}${token}`;
  }

  /**
   * 根据用户ID查找用户
   * @param userId - 用户ID
   * @returns 用户实体
   */
  async findUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
