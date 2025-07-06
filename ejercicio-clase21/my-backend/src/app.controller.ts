import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Servidor NestJS con WebSockets funcionando 🚀';
  }
}
