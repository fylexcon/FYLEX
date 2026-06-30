import { Injectable, NotFoundException } from '@nestjs/common';
import type { Platform } from '@fylex/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        id
      },
      include: {
        achievements: true,
        externalIds: true,
        priceOffers: {
          orderBy: {
            salePrice: 'asc'
          },
          take: 5
        }
      }
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return {
      id: game.id,
      slug: game.slug,
      title: game.title,
      coverUrl: game.coverUrl,
      genres: game.genres,
      modes: game.modes,
      crossplayPlatforms: game.crossplayPlatforms as Platform[],
      externalIds: game.externalIds,
      achievements: game.achievements,
      bestOffers: game.priceOffers.map((offer) => ({
        ...offer,
        regularPrice: Number(offer.regularPrice),
        salePrice: Number(offer.salePrice),
        fetchedAt: offer.fetchedAt.toISOString(),
        startsAt: offer.startsAt?.toISOString() ?? null,
        endsAt: offer.endsAt?.toISOString() ?? null
      }))
    };
  }
}
