import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  async check() {
    const database = await this.checkDatabase();
    const redis = await this.checkRedis();

    return {
      api: 'ok',
      database,
      redis,
      timestamp: new Date().toISOString()
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'ok';
    } catch {
      return 'unavailable';
    }
  }

  private async checkRedis() {
    try {
      if (this.redis.status === 'wait') {
        await this.redis.connect();
      }

      return (await this.redis.ping()) === 'PONG' ? 'ok' : 'unavailable';
    } catch {
      return 'unavailable';
    }
  }
}
