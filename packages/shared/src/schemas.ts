import { z } from 'zod';
import { platforms } from './platform';

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().min(2).max(40)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(16)
});

export const platformSchema = z.enum(platforms);

export const createLfgPostSchema = z.object({
  gameId: z.string().uuid(),
  platform: platformSchema,
  region: z.string().min(2).max(24),
  language: z.string().min(2).max(24),
  skillBand: z.string().min(2).max(32),
  rolesNeeded: z.array(z.string().min(1).max(24)).min(1).max(5),
  playstyleTags: z.array(z.string().min(1).max(24)).max(8),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime()
});

export const createDealWatchlistSchema = z.object({
  gameId: z.string().uuid(),
  targetPrice: z.number().positive().optional(),
  targetDiscount: z.number().min(1).max(100).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type CreateLfgPostInput = z.infer<typeof createLfgPostSchema>;
export type CreateDealWatchlistInput = z.infer<typeof createDealWatchlistSchema>;
