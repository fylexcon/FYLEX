# FYLEX

FYLEX is a Steam-first social gaming platform MVP built as an npm-workspaces monorepo.

## Apps

- `apps/api` - NestJS API, Prisma, Postgres, Redis, Steam provider adapter, chat gateway.
- `apps/mobile` - Expo React Native app with dark gamer UI, auth shell, library, LFG, chat, and deals tabs.
- `packages/shared` - Shared platform enums, DTOs, and validation schemas.

## Local Setup

1. Copy `.env.example` to `.env` and fill secrets as needed.
2. Start infrastructure:

```bash
npm run docker:up
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run db:generate
```

5. Start the API:

```bash
npm run dev:api
```

6. Start the mobile app:

```bash
npm run dev:mobile
```

Steam live sync uses `STEAM_API_KEY`. Without it, the API falls back to mock Steam data so local development remains usable.
