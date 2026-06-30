import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ClientMessage = {
  roomId: string;
  senderId?: string;
  body: string;
};

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit('connected', {
      socketId: client.id
    });
  }

  @SubscribeMessage('room:join')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string }) {
    client.join(body.roomId);
    client.emit('room:joined', body);
  }

  @SubscribeMessage('room:leave')
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string }) {
    client.leave(body.roomId);
    client.emit('room:left', body);
  }

  @SubscribeMessage('message:send')
  sendMessage(@ConnectedSocket() client: Socket, @MessageBody() body: ClientMessage) {
    const message = {
      id: crypto.randomUUID(),
      roomId: body.roomId,
      senderId: body.senderId ?? client.id,
      body: body.body,
      createdAt: new Date().toISOString()
    };

    this.server.to(body.roomId).emit('message:new', message);
    return message;
  }

  @SubscribeMessage('typing:start')
  typingStart(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string; userId?: string }) {
    client.to(body.roomId).emit('typing:start', {
      roomId: body.roomId,
      userId: body.userId ?? client.id
    });
  }

  @SubscribeMessage('typing:stop')
  typingStop(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string; userId?: string }) {
    client.to(body.roomId).emit('typing:stop', {
      roomId: body.roomId,
      userId: body.userId ?? client.id
    });
  }
}
