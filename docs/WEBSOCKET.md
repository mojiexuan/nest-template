# WebSocket 模块使用说明

## 功能特性

- ✅ 实时双向通信
- ✅ 房间（Room）管理
- ✅ 广播消息
- ✅ 在线用户统计
- ✅ 连接状态管理

## 启动服务

```bash
pnpm run start:dev
```

服务启动后，WebSocket 服务将在以下地址可用：

- **WebSocket 地址**: `ws://localhost:13000/ws`

## 测试客户端

项目根目录下提供了一个 HTML 测试客户端：`websocket-test.html`

直接在浏览器中打开该文件即可测试 WebSocket 功能。

## 支持的事件

### 客户端 -> 服务器

| 事件名           | 参数                                | 说明                 |
| ---------------- | ----------------------------------- | -------------------- |
| `message`        | `{ content: string }`               | 发送消息给服务器     |
| `broadcast`      | `{ content: string }`               | 广播消息给所有客户端 |
| `joinRoom`       | `{ room: string }`                  | 加入指定房间         |
| `leaveRoom`      | `{ room: string }`                  | 离开指定房间         |
| `roomMessage`    | `{ room: string, content: string }` | 向房间发送消息       |
| `getOnlineCount` | -                                   | 获取在线用户数       |

### 服务器 -> 客户端

| 事件名        | 数据                                 | 说明             |
| ------------- | ------------------------------------ | ---------------- |
| `welcome`     | `{ message, clientId, timestamp }`   | 连接成功欢迎消息 |
| `message`     | `{ content, timestamp }`             | 服务器回复的消息 |
| `broadcast`   | `{ content, from, timestamp }`       | 广播消息         |
| `userJoined`  | `{ userId, room, timestamp }`        | 用户加入房间通知 |
| `userLeft`    | `{ userId, room, timestamp }`        | 用户离开房间通知 |
| `roomMessage` | `{ content, from, room, timestamp }` | 房间消息         |
| `onlineCount` | `{ count, timestamp }`               | 在线用户数       |

## 使用示例

### JavaScript 客户端

```javascript
import { io } from 'socket.io-client';

// 连接到 WebSocket 服务
const socket = io('http://localhost:13000/ws');

// 监听连接成功
socket.on('connect', () => {
  console.log('已连接到服务器');
});

// 监听欢迎消息
socket.on('welcome', (data) => {
  console.log('欢迎消息:', data);
});

// 发送消息
socket.emit('message', { content: 'Hello Server!' });

// 监听消息回复
socket.on('message', (data) => {
  console.log('收到消息:', data);
});

// 广播消息
socket.emit('broadcast', { content: 'Hello Everyone!' });

// 监听广播消息
socket.on('broadcast', (data) => {
  console.log('广播消息:', data);
});

// 加入房间
socket.emit('joinRoom', { room: 'room1' });

// 监听用户加入房间
socket.on('userJoined', (data) => {
  console.log('用户加入:', data);
});

// 发送房间消息
socket.emit('roomMessage', { room: 'room1', content: 'Hello Room!' });

// 监听房间消息
socket.on('roomMessage', (data) => {
  console.log('房间消息:', data);
});

// 获取在线人数
socket.emit('getOnlineCount');

// 监听在线人数
socket.on('onlineCount', (data) => {
  console.log('在线人数:', data.count);
});

// 断开连接
socket.on('disconnect', () => {
  console.log('已断开连接');
});
```

### React 客户端示例

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:13000/ws');

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, connected };
}

function ChatComponent() {
  const { socket, connected } = useWebSocket();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data) => {
      setMessages(prev => [...prev, data.content]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = (content: string) => {
    socket?.emit('message', { content });
  };

  return (
    <div>
      <div>状态: {connected ? '已连接' : '未连接'}</div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <button onClick={() => sendMessage('Hello!')}>发送</button>
    </div>
  );
}
```

## 配置说明

WebSocket 网关配置位于 `src/modules/websocket/websocket.gateway.ts`：

```typescript
@WebSocketGateway({
  cors: {
    origin: '*', // 生产环境建议配置具体域名
  },
  namespace: '/ws', // WebSocket 命名空间
})
```

## 安全建议

1. **CORS 配置**: 生产环境应限制允许的域名
2. **认证**: 可以在 `handleConnection` 中添加 JWT 验证
3. **限流**: 建议添加消息频率限制
4. **输入验证**: 对客户端发送的数据进行验证

## 扩展功能

可以根据需求添加更多功能：

- 私聊功能
- 消息持久化
- 在线状态同步
- 文件传输
- 视频/音频通话信令
