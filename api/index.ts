import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../apps/api/src/app.module';

type ExpressServer = ReturnType<typeof express>;

let serverPromise: Promise<ExpressServer> | undefined;

async function createServer(): Promise<ExpressServer> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const config = app.get(ConfigService);
  const origin = config.get<string>('API_ORIGIN') ?? '*';

  app.enableCors({ origin, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('v1');
  await app.init();

  return server;
}

export default async function handler(request: any, response: any) {
  serverPromise ??= createServer();
  const server = await serverPromise;
  return server(request, response);
}
