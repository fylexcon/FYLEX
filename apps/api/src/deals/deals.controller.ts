import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { createDealWatchlistSchema, type CreateDealWatchlistInput } from '@fylex/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/auth-request';
import { CurrentUser } from '../common/current-user.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { DealsService } from './deals.service';

@Controller('deals/watchlist')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.deals.list(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createDealWatchlistSchema)) body: CreateDealWatchlistInput
  ) {
    return this.deals.create(user.id, body);
  }
}
