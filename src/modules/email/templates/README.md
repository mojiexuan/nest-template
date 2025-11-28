# 邮件模板说明

## 模板变量

模板使用 `{{VARIABLE_NAME}}` 格式来定义变量占位符。

### verification-code.html - 验证码邮件模板

**可用变量：**

- `{{APP_NAME}}` - 应用名称
- `{{CODE_DIGITS}}` - 验证码数字（HTML格式）
- `{{EXPIRES_IN_MINUTES}}` - 过期时间（分钟）
- `{{YEAR}}` - 当前年份

**示例：**

```typescript
const html = EmailTemplateUtil.renderTemplate('verification-code', {
  APP_NAME: '智道AI',
  CODE_DIGITS: '<div class="code-digit">1</div><div class="code-digit">2</div>...',
  EXPIRES_IN_MINUTES: '5',
  YEAR: '2025',
});
```

### welcome.html - 欢迎邮件模板

**可用变量：**

- `{{APP_NAME}}` - 应用名称
- `{{USERNAME}}` - 用户名
- `{{YEAR}}` - 当前年份

**示例：**

```typescript
const html = EmailTemplateUtil.renderTemplate('welcome', {
  APP_NAME: '智道AI',
  USERNAME: '张三',
  YEAR: '2025',
});
```

### password-reset.html - 密码重置邮件模板

**可用变量：**

- `{{APP_NAME}}` - 应用名称
- `{{RESET_URL}}` - 密码重置链接
- `{{YEAR}}` - 当前年份

**示例：**

```typescript
const html = EmailTemplateUtil.renderTemplate('password-reset', {
  APP_NAME: '智道AI',
  RESET_URL: 'https://example.com/reset-password?token=xxx',
  YEAR: '2025',
});
```

## 创建新模板

1. 在 `templates` 目录下创建新的 `.html` 文件
2. 使用 `{{VARIABLE_NAME}}` 定义变量占位符
3. 在 `EmailService` 中使用 `EmailTemplateUtil.renderTemplate()` 渲染模板

**模板示例：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>{{TITLE}}</title>
  </head>
  <body>
    <h1>{{GREETING}}</h1>
    <p>{{CONTENT}}</p>
  </body>
</html>
```

**使用示例：**

```typescript
const html = EmailTemplateUtil.renderTemplate('your-template', {
  TITLE: '邮件标题',
  GREETING: '您好',
  CONTENT: '邮件内容',
});
```

## 模板设计规范

1. **响应式设计**：使用媒体查询适配移动设备
2. **内联样式**：部分邮件客户端不支持外部CSS，建议使用内联样式或内部样式表
3. **兼容性**：避免使用现代CSS特性，确保在各种邮件客户端中正常显示
4. **图片处理**：使用base64编码或CDN链接
5. **变量命名**：使用大写字母和下划线，如 `{{USER_NAME}}`

## 预览模板

可以直接在浏览器中打开HTML文件预览效果，变量会显示为占位符。
