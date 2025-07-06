import { Injectable } from '@nestjs/common';
import { Notification } from './interfaces/notification.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [];

  // crea una notificación y la agrega al array
  create(
    message: string,
    userId: string,
    type: Notification['type'] = 'info',
  ): Notification {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    return notification;
  }
  // busca notificaciones por userId y devuelve un array de notificaciones
  findByUser(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }
  // marca una notificación especifica como leída
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
  // cuenta cuantas notificaciones leidas tiene un usuario
  countUnreadByUser(userId: string): number {
    return this.notifications.filter((n) => n.userId === userId && !n.read)
      .length;
  }

  getAllNotifications(): Notification[] {
    return this.notifications;
  }
}
