import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.games.get(id);
  }
}
