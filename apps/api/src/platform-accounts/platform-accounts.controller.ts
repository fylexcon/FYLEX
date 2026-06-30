import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { platformSchema, type Platform } from '@fylex/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/auth-request';
import { CurrentUser } from '../common/current-user.decorator';
import { PlatformAccountsService } from './platform-accounts.service';

@Controller('platform-accounts')
@UseGuards(JwtAuthGuard)
export class PlatformAccountsController {
  constructor(private readonly platformAccounts: PlatformAccountsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.platformAccounts.list(user.id);
  }

  @Post(':platform/link/mock')
  linkMock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('platform') platformParam: string,
    @Body() body: { externalUserId?: string; handle?: string }
  ) {
    const platform = platformSchema.parse(platformParam) as Platform;
    return this.platformAccounts.linkMock(user.id, platform, body);
  }

  @Post(':id/sync')
  sync(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.platformAccounts.sync(user.id, id);
  }
}
