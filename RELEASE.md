# FYLEX release checklist

## 1. Supabase

Create a Supabase Postgres project and copy the Session Pooler URL to `DATABASE_URL` and the direct or dedicated pooler URL to `DIRECT_URL` in Render. Run the initial migration once from a trusted machine:

```powershell
$env:DATABASE_URL = "<session-pooler-url>"
$env:DIRECT_URL = "<direct-url>"
npm run db:migrate --workspace @fylex/api -- --name init
```

## 2. Render

Connect the repository in Render and use the Blueprint from `render.yaml`, or create a Docker web service with the repository root as its context. Set `API_ORIGIN` to the mobile/app origins and provide the Supabase URLs, `REDIS_URL`, and optional `STEAM_API_KEY` as secrets. Render will build `Dockerfile`, expose port 4000, and check `/v1/health`.

After the first migration has been committed, configure the deploy command as `npm run db:deploy --workspace @fylex/api` if migrations are applied during deployment.

## 3. Android preview APK

Install or use the EAS CLI, log in to an Expo account, and run from `apps/mobile`:

```powershell
npx eas-cli@latest build --profile preview --platform android
```

The preview profile produces an installable APK for testers. The production profile produces an Android App Bundle for Google Play.

## 4. Verification

```powershell
npm run release:check
npm run test --workspace @fylex/api -- --runInBand
```

Before public launch, replace the mock Steam link flow with Steam OpenID, add rate limiting and email verification, configure a managed Redis instance, and set up crash/error monitoring.
