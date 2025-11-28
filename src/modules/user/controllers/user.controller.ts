import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { UserId } from '@common/decorators/user-id.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户（注册接口，公开）
   * @param createUserDto - 创建用户数据
   * @returns 创建的用户
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取用户列表
   * @param queryUserDto - 查询参数
   * @returns 分页的用户列表
   */
  @Get()
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  /**
   * 根据ID获取用户
   * @param id - 用户ID
   * @returns 用户详情
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * 获取当前登录用户信息
   * @param userId - 自动注入的用户ID
   * @returns 当前用户详情
   */
  @Get('me/profile')
  getMyProfile(@UserId() userId: string) {
    return this.userService.findOne(userId);
  }

  /**
   * 更新用户
   * @param id - 用户ID
   * @param updateUserDto - 更新用户数据
   * @returns 更新后的用户
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * 删除用户
   * @param id - 用户ID
   * @returns 空响应
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
