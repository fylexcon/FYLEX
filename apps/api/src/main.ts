import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const origin = config.get<string>('API_ORIGIN') ?? '*';

  app.enableCors({
    origin,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );
  app.setGlobalPrefix('v1');

  const port = Number(config.get<string>('PORT') ?? config.get<string>('API_PORT') ?? 4000);
  await app.listen(port);
}

void bootstrap();
