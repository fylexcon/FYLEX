# Supabase production database

Create a Supabase project, then copy the two PostgreSQL URLs from the project dashboard's Connect dialog:

- `DATABASE_URL`: use the Session Pooler URL for the Render runtime.
- `DIRECT_URL`: use the direct database URL or a dedicated pooler URL for Prisma migrations.

Set both values as Render secrets. Then run the first migration from a machine that has those values loaded:

```powershell
$env:DATABASE_URL = "<supabase-session-pooler-url>"
$env:DIRECT_URL = "<supabase-direct-url>"
npm run db:migrate --workspace @fylex/api -- --name init
```

For a hosted deployment, prefer `prisma migrate deploy` after the migration is committed. Keep database passwords only in Supabase and Render secret stores.
