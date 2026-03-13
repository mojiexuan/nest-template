import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket 网关
 * 处理实时通信
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebsocketGateway');
  private connectedClients = new Map<string, Socket>();

  /**
   * 客户端连接时触发
   */
  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    this.logger.log(`客户端已连接: ${client.id}, 当前在线: ${this.connectedClients.size}`);

    // 向客户端发送欢迎消息
    client.emit('welcome', {
      message: '欢迎连接到 WebSocket 服务',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 客户端断开连接时触发
   */
  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`客户端已断开: ${client.id}, 当前在线: ${this.connectedClients.size}`);
  }

  /**
   * 处理消息事件
   */
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { content: string }, @ConnectedSocket() client: Socket) {
    this.logger.log(`收到消息 [${client.id}]: ${data.content}`);

    // 回复发送者
    return {
      event: 'message',
      data: {
        content: `服务器收到: ${data.content}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * 广播消息给所有客户端
   */
  @SubscribeMessage('broadcast')
  handleBroadcast(@MessageBody() data: { content: string }, @ConnectedSocket() client: Socket) {
    this.logger.log(`广播消息 [${client.id}]: ${data.content}`);

    // 广播给所有客户端（包括发送者）
    this.server.emit('broadcast', {
      content: data.content,
      from: client.id,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * 加入房间
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    void client.join(data.room);
    this.logger.log(`客户端 ${client.id} 加入房间: ${data.room}`);

    // 通知房间内其他成员
    client.to(data.room).emit('userJoined', {
      userId: client.id,
      room: data.room,
      timestamp: new Date().toISOString(),
    });

    return { success: true, room: data.room };
  }

  /**
   * 离开房间
   */
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    void client.leave(data.room);
    this.logger.log(`客户端 ${client.id} 离开房间: ${data.room}`);

    // 通知房间内其他成员
    client.to(data.room).emit('userLeft', {
      userId: client.id,
      room: data.room,
      timestamp: new Date().toISOString(),
    });

    return { success: true, room: data.room };
  }

  /**
   * 向指定房间发送消息
   */
  @SubscribeMessage('roomMessage')
  handleRoomMessage(@MessageBody() data: { room: string; content: string }, @ConnectedSocket() client: Socket) {
    this.logger.log(`房间消息 [${data.room}] from ${client.id}: ${data.content}`);

    // 发送给房间内所有成员（包括发送者）
    this.server.to(data.room).emit('roomMessage', {
      content: data.content,
      from: client.id,
      room: data.room,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * 获取在线用户数
   */
  @SubscribeMessage('getOnlineCount')
  handleGetOnlineCount() {
    return {
      event: 'onlineCount',
      data: {
        count: this.connectedClients.size,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
