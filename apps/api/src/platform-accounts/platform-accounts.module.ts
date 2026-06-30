import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProvidersModule } from '../providers/providers.module';
import { PlatformAccountsController } from './platform-accounts.controller';
import { PlatformAccountsService } from './platform-accounts.service';

@Module({
  imports: [AuthModule, ProvidersModule],
  controllers: [PlatformAccountsController],
  providers: [PlatformAccountsService],
  exports: [PlatformAccountsService]
})
export class PlatformAccountsModule {}
