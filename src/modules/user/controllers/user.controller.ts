import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTag, ApiOperation, HttpMethod } from 'docupress-api';
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
@ApiTag({ name: '用户', description: '用户增删改查' })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    method: HttpMethod.POST,
    path: '/api/users',
    summary: '创建用户（注册）',
    body: CreateUserDto,
  })
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/users',
    summary: '获取用户列表',
  })
  @Get()
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/users/me/profile',
    summary: '获取当前登录用户信息',
  })
  @Get('me/profile')
  getMyProfile(@UserId() userId: string) {
    return this.userService.findOne(userId);
  }

  @ApiOperation({
    method: HttpMethod.GET,
    path: '/api/users/:id',
    summary: '根据ID获取用户',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    method: HttpMethod.PATCH,
    path: '/api/users/:id',
    summary: '更新用户',
    body: UpdateUserDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({
    method: HttpMethod.DELETE,
    path: '/api/users/:id',
    summary: '删除用户',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
