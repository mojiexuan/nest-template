import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUser: Partial<User> = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    nickname: 'Test User',
    status: UserStatus.NORMAL,
    userType: UserType.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // 重置所有 mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: '123456',
    };

    it('应该成功创建用户', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser as User);
      mockRepository.save.mockResolvedValue(mockUser as User);

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('用户名已存在时应抛出 ConflictException', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser as User);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('应该返回用户', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser as User);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('用户不存在时应抛出 NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('应该返回分页用户列表', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as unknown);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('update', () => {
    it('应该更新用户', async () => {
      const updateDto = { nickname: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockUser as User);
      mockRepository.save.mockResolvedValue(updatedUser as User);

      const result = await service.update('1', updateDto);

      expect(result.nickname).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('应该删除用户', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser as User);
      mockRepository.remove.mockResolvedValue(mockUser as User);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('用户不存在时应抛出 NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
