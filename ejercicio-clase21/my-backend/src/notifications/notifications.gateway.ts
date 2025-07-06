import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { NotificationUser } from './interfaces/notification.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  public server: Server;
  // guarda los usuarios conectados usando un Map donde la clave es userId
  private connectedUsers: Map<string, NotificationUser> = new Map();

  constructor(private readonly notificationsService: NotificationsService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server: Server): void {
    console.log(`Server initialized.`);
  }
  // método que es llamado cuando un cliente se conecta
  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string;
    // si no se proporciona userId, el cliente se desconecta
    if (!userId) {
      client.disconnect();
      return;
    }

    const user: NotificationUser = {
      id: client.id,
      socketId: client.id,
      userId,
    };

    this.connectedUsers.set(userId, user);
    console.log(`User connected: ${userId}`);
    // envio al cliente sus notificaciones actuales y el contador de no leídas
    const notifications = this.notificationsService.findByUser(userId);
    const unreadCount = this.notificationsService.countUnreadByUser(userId);

    this.server.to(client.id).emit('allNotifications', { notifications });
    this.server.to(client.id).emit('unreadCountUpdated', { unreadCount });
  }

  handleDisconnect(client: Socket): void {
    for (const [userId, user] of this.connectedUsers) {
      if (user.socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('sendNotification')
  handleSendNotification(
    client: Socket,
    payload: {
      user_id: string;
      message: string;
      type: string;
      toAll?: boolean;
    },
  ): void {
    if (payload.toAll) {
      // si se indica toAll, envio la notificación a todos los usuarios conectados
      this.connectedUsers.forEach((user) => {
        const notification = this.notificationsService.create(
          payload.message,
          user.userId,
          payload.type as 'info' | 'warning' | 'error' | 'success' | undefined,
        );
        this.server.to(user.socketId).emit('new-notification', notification);

        const unreadCount = this.notificationsService.countUnreadByUser(
          user.userId,
        );
        this.server
          .to(user.socketId)
          .emit('unreadCountUpdated', { unreadCount });
      });
    } else {
      // si es solo para un usuario específico
      const notification = this.notificationsService.create(
        payload.message,
        payload.user_id,
        payload.type as 'info' | 'warning' | 'error' | 'success' | undefined,
      );
      const user = this.connectedUsers.get(payload.user_id);

      if (user) {
        this.server.to(user.socketId).emit('new-notification', notification);

        const unreadCount = this.notificationsService.countUnreadByUser(
          payload.user_id,
        );
        this.server
          .to(user.socketId)
          .emit('unreadCountUpdated', { unreadCount });
      }
    }
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(@MessageBody() data: { id: string; userId: string }): void {
    // marco la notificación en memoria
    this.notificationsService.markAsRead(data.id);
    // actualizo el contador de no leídas para el usuario
    const unreadCount = this.notificationsService.countUnreadByUser(
      data.userId,
    );

    const user = this.connectedUsers.get(data.userId);
    if (user) {
      this.server.to(user.socketId).emit('unreadCountUpdated', { unreadCount });
      // reenvio todas las notificaciones para refrescar el estado del cliente
      const notifications = this.notificationsService.findByUser(data.userId);
      this.server.to(user.socketId).emit('allNotifications', { notifications });
    }
  }

  @SubscribeMessage('getAllNotifications')
  handleGetAllNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { user_id: string },
  ): void {
    const notifications = this.notificationsService.findByUser(payload.user_id);
    this.server.to(client.id).emit('allNotifications', { notifications });
  }
}
