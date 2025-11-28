import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { UserStatus } from '../enums/user-status.enum';

/**
 * 用户实体
 * 定义用户数据表结构
 */
@Entity('users')
export class User {
  /**
   * 用户ID（主键）
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 用户名（唯一）
   */
  @Column({ unique: true, length: 50 })
  username: string;

  /**
   * 邮箱（唯一）
   */
  @Column({ unique: true, length: 100 })
  email: string;

  /**
   * 密码哈希
   */
  @Column({ length: 255 })
  password: string;

  /**
   * 昵称
   */
  @Column({ length: 100, nullable: true })
  nickname: string;

  /**
   * 头像URL
   */
  @Column({ length: 255, nullable: true })
  avatar: string;

  /**
   * 微信OpenID（用于微信登录）
   */
  @Column({ length: 100, unique: true, nullable: true })
  openid: string;

  /**
   * 用户类型（学生/教师）
   */
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STUDENT,
  })
  userType: UserType;

  /**
   * 用户状态（正常/封禁/待审核）
   */
  @Column({
    type: 'int',
    default: UserStatus.NORMAL,
  })
  status: UserStatus;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
