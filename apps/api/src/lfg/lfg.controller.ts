import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { createLfgPostSchema, type CreateLfgPostInput } from '@fylex/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/auth-request';
import { CurrentUser } from '../common/current-user.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { LfgService } from './lfg.service';

@Controller('lfg')
export class LfgController {
  constructor(private readonly lfg: LfgService) {}

  @Get()
  list() {
    return this.lfg.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createLfgPostSchema)) body: CreateLfgPostInput
  ) {
    return this.lfg.create(user.id, body);
  }
}
