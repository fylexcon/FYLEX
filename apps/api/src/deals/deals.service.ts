import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateDealWatchlistInput, DealWatchlistDto, Platform } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<DealWatchlistDto[]> {
    const watchlist = await this.prisma.dealWatchlist.findMany({
      where: {
        userId
      },
      include: {
        game: {
          include: {
            priceOffers: {
              orderBy: {
                salePrice: 'asc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        game: {
          title: 'asc'
        }
      }
    });

    return watchlist.map((item) => ({
      id: item.id,
      targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      targetDiscount: item.targetDiscount,
      game: {
        id: item.game.id,
        slug: item.game.slug,
        title: item.game.title,
        coverUrl: item.game.coverUrl,
        genres: item.game.genres,
        modes: item.game.modes,
        crossplayPlatforms: item.game.crossplayPlatforms as Platform[]
      },
      bestOffer: item.game.priceOffers[0]
        ? {
            id: item.game.priceOffers[0].id,
            platformStore: item.game.priceOffers[0].platformStore as Platform | 'isthereanydeal',
            country: item.game.priceOffers[0].country,
            currency: item.game.priceOffers[0].currency,
            regularPrice: Number(item.game.priceOffers[0].regularPrice),
            salePrice: Number(item.game.priceOffers[0].salePrice),
            discountPercent: item.game.priceOffers[0].discountPercent,
            url: item.game.priceOffers[0].url,
            startsAt: item.game.priceOffers[0].startsAt?.toISOString() ?? null,
            endsAt: item.game.priceOffers[0].endsAt?.toISOString() ?? null,
            fetchedAt: item.game.priceOffers[0].fetchedAt.toISOString()
          }
        : null
    }));
  }

  async create(userId: string, input: CreateDealWatchlistInput): Promise<DealWatchlistDto> {
    const game = await this.prisma.game.findUnique({
      where: {
        id: input.gameId
      }
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    await this.prisma.dealWatchlist.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId: input.gameId
        }
      },
      update: {
        targetPrice: input.targetPrice,
        targetDiscount: input.targetDiscount
      },
      create: {
        userId,
        gameId: input.gameId,
        targetPrice: input.targetPrice,
        targetDiscount: input.targetDiscount
      }
    });

    const [created] = await this.list(userId);
    return created;
  }
}
