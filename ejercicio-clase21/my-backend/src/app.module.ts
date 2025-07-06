import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    console.log('AppModule initialized');
  }
}
