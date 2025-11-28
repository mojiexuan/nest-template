import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResponse } from '@common/types/response.type';
import { PasswordUtil } from '@common/utils/password.util';
import { User } from '../entities/user.entity';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { QueryUserDto } from '../dto/query-user.dto';
import type { UpdateUserDto } from '../dto/update-user.dto';

/**
 * 用户服务
 * 处理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户
   * @param createUserDto - 创建用户数据传输对象
   * @returns 创建的用户实体
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 创建用户并加密密码
    const hashedPassword = await PasswordUtil.hash(password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  /**
   * 分页查询用户列表
   * @param queryUserDto - 查询参数
   * @returns 分页的用户列表
   */
  async findAll(queryUserDto: QueryUserDto): Promise<PaginatedResponse<User>> {
    const { page = 1, pageSize = 10, keyword } = queryUserDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 关键词搜索
    if (keyword) {
      queryBuilder.where('user.username LIKE :keyword OR user.email LIKE :keyword OR user.nickname LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // 分页
    const [items, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 根据ID查询用户
   * @param id - 用户ID
   * @returns 用户实体
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户
   * @param id - 用户ID
   * @param updateUserDto - 更新用户数据传输对象
   * @returns 更新后的用户实体
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 如果更新密码，需要加密
    const dtoWithPassword = updateUserDto as UpdateUserDto & { password?: string };
    if (dtoWithPassword.password) {
      dtoWithPassword.password = await PasswordUtil.hash(dtoWithPassword.password);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * 删除用户
   * @param id - 用户ID
   * @returns void
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
