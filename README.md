# Chenille Server

企业级NestJS项目模板 - 采用TypeScript、PostgreSQL、企业级代码规范

## 特性

- ✅ **NestJS 10** - 渐进式Node.js框架
- ✅ **TypeScript** - 类型安全
- ✅ **PostgreSQL + TypeORM** - 强大的ORM支持
- ✅ **Redis** - 缓存和会话管理
- ✅ **JWT认证** - 基于Redis的有状态JWT认证
- ✅ **自动权限验证** - 全局守卫自动验证，无需手动处理
- ✅ **企业级架构** - 严格分层（Controller、Service、Repository）
- ✅ **代码规范** - ESLint + Prettier
- ✅ **文件行数限制** - 通用文件不超过200行
- ✅ **中文文档注释** - 所有函数、类、模块必须提供中文JSDoc注释
- ✅ **统一响应格式** - code, message, data, time
- ✅ **全局异常处理** - 统一错误响应格式
- ✅ **全局响应拦截器** - 统一成功响应格式
- ✅ **数据验证** - class-validator
- ✅ **环境配置** - 支持.env配置文件

## 目录结构

```
src/
├── common/                 # 通用模块
│   ├── dto/               # 通用数据传输对象
│   │   └── pagination.dto.ts
│   ├── filters/           # 全局过滤器
│   │   └── http-exception.filter.ts
│   ├── interceptors/      # 全局拦截器
│   │   └── transform.interceptor.ts
│   ├── types/             # 类型定义
│   │   └── response.type.ts
│   └── utils/             # 工具类
│       ├── crypto.util.ts
│       └── date.util.ts
├── config/                # 配置文件
│   └── database.config.ts
├── modules/               # 业务模块
│   └── user/             # 用户模块示例
│       ├── controllers/  # 控制器
│       ├── services/     # 服务层
│       ├── entities/     # 实体
│       ├── dto/          # 数据传输对象
│       └── user.module.ts
├── app.module.ts         # 根模块
├── app.controller.ts     # 根控制器
├── app.service.ts        # 根服务
└── main.ts               # 应用入口
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置（PostgreSQL）
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=chenille

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT密钥（生产环境必须修改）
JWT_SECRET=your-strong-secret-key
```

**注意**：运行前确保PostgreSQL和Redis已启动

### 3. 启动开发服务器

```bash
# 开发模式（热重载）
pnpm start:dev

# 普通模式
pnpm start

# 调试模式
pnpm start:debug
```

### 4. 构建生产版本

```bash
pnpm build
pnpm start:prod
```

## API文档

启动服务器后，访问 `http://localhost:3000/api`

### 统一响应格式

所有API接口采用统一的响应格式：

**成功响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "time": "2025-11-23T08:00:00.123Z"
}
```

**错误响应**：

```json
{
  "code": 404,
  "message": "用户不存在",
  "time": "2025-11-23T08:00:00.123Z"
}
```

详细说明请查看 [API_RESPONSE_FORMAT.md](./API_RESPONSE_FORMAT.md)

### JWT认证

本项目实现了**自动权限验证**系统：

- 🔒 **默认需要认证** - 所有接口默认需要JWT验证
- 🔓 **公开接口** - 使用`@Public()`装饰器标记公开接口
- 🆔 **自动注入用户ID** - 使用`@UserId()`装饰器获取当前用户ID
- 🗄️ **有状态Token** - Token存储在Redis中，支持强制登出

```typescript
// 公开接口
@Public()
@Post('login')
async login(@Body() dto: LoginDto) {
  return await this.authService.login(dto);
}

// 受保护接口（自动需要认证）
@Get('profile')
getProfile(@UserId() userId: string) {
  return this.userService.findOne(userId);
}
```

详细说明请查看 [JWT_AUTH_GUIDE.md](./JWT_AUTH_GUIDE.md)

### 认证接口

#### 登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGc...",
    "userId": "uuid",
    "username": "testuser",
    "email": "test@example.com"
  },
  "time": "2025-11-23T08:00:00.123Z"
}
```

#### 登出

```http
POST /api/auth/logout
Authorization: Bearer your-token
```

#### 刷新Token

```http
POST /api/auth/refresh
Authorization: Bearer your-token
```

### 用户接口示例

#### 注册用户（公开）

```http
POST /api/users
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "nickname": "测试用户"
}
```

#### 获取当前用户信息（需认证）

```http
GET /api/users/me/profile
Authorization: Bearer your-token
```

#### 获取用户列表（需认证）

```http
GET /api/users?page=1&pageSize=10&keyword=test
Authorization: Bearer your-token
```

#### 获取单个用户（需认证）

```http
GET /api/users/:id
Authorization: Bearer your-token
```

#### 更新用户

```http
PATCH /api/users/:id
Content-Type: application/json

{
  "nickname": "新昵称"
}
```

#### 删除用户

```http
DELETE /api/users/:id
```

## 代码规范

### 文件行数限制

- 通用文件（utils, services等）：不得超过 **200行**
- ESLint会在超过200行时发出警告
- 积极按功能、模块、子组件拆分文件

### 文档注释规范

所有函数、类、模块必须提供符合JSDoc规范的**中文文档注释**：

```typescript
/**
 * 用户服务
 * 处理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  /**
   * 创建用户
   * @param createUserDto - 创建用户数据传输对象
   * @returns 创建的用户实体
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // ...
  }
}
```

### 分层架构

严格区分：

- **Controller层** - 处理HTTP请求，参数验证
- **Service层** - 业务逻辑处理
- **Repository层** - 数据访问（TypeORM）
- **Utils** - 工具函数
- **DTO** - 数据传输对象（请求/响应）
- **Entity** - 数据库实体

## 开发指南

### 创建新模块

```bash
# 使用NestJS CLI
nest g module modules/your-module
nest g controller modules/your-module/controllers/your-module
nest g service modules/your-module/services/your-module
```

### 数据库迁移

```bash
# 生成迁移文件
npm run typeorm migration:generate -- -n MigrationName

# 运行迁移
npm run typeorm migration:run

# 回滚迁移
npm run typeorm migration:revert
```

## 测试

```bash
# 单元测试
pnpm test

# 监听模式
pnpm test:watch

# 测试覆盖率
pnpm test:cov

# e2e测试
pnpm test:e2e
```

## 代码检查

```bash
# 运行ESLint
pnpm lint

# 格式化代码
pnpm format
```

## 技术栈

- **框架**: NestJS 10
- **语言**: TypeScript 5
- **数据库**: PostgreSQL
- **ORM**: TypeORM 0.3
- **缓存**: Redis (ioredis)
- **认证**: JWT + Passport
- **密码加密**: bcrypt
- **验证**: class-validator
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier

## 许可证

MIT
