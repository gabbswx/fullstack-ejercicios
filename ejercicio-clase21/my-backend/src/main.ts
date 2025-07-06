import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para que el cliente pueda conectarse sin errores

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Notificaciones en tiempo real escuchando en http://localhost:${port}`,
  );
}
void bootstrap();
