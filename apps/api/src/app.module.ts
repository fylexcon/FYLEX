import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DealsModule } from './deals/deals.module';
import { GamesModule } from './games/games.module';
import { HealthModule } from './health/health.module';
import { LfgModule } from './lfg/lfg.module';
import { LibraryModule } from './library/library.module';
import { PlatformAccountsModule } from './platform-accounts/platform-accounts.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule } from './providers/providers.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env']
    }),
    PrismaModule,
    RedisModule,
    ProvidersModule,
    AuthModule,
    UsersModule,
    PlatformAccountsModule,
    LibraryModule,
    GamesModule,
    LfgModule,
    DealsModule,
    ChatModule,
    HealthModule
  ]
})
export class AppModule {}
