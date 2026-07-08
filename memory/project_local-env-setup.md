---
name: project-local-env-setup
description: Local dev setup gotchas — Node version and Supabase key requirements
metadata:
  type: project
---

This machine's system Node was 18.15.0, but the project requires **Node
20.9+** (Next.js 16 / React 19 engine requirement; README says tested on Node
24). No nvm was installed as of 2026-07-08. Fixed by installing nvm
(`v0.40.1`) and `nvm install 24`, then running `npm install` under Node 24.
`node_modules` was not present before that — always run `npm install` after a
fresh clone.

The dev-server launch config lives in `cc_fundamentals/.claude/launch.json`
(the Preview tool resolves `launch.json` relative to the *primary* working
directory, not this repo) — it sources nvm, does `nvm use 24`, then `cd`s into
this repo and runs `npm run dev`. Registered as `comunidad-dev` on port 3000.

`.env.local` can exist with both `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` **keys present but values empty** — this looks
configured at a glance (e.g. a naive `sed` redaction over the file will make
empty values look populated) but isn't. The app fails at signup/login time
with "Supabase no está configurado" (`src/lib/supabase/env.ts`), not at
startup — the marketing site still renders fine without keys, only auth/DB
actions fail. Always verify actual byte content (`od -c .env.local` or
open the file) rather than trusting a grep/sed pass, when checking whether
Supabase is really wired up.

**Why:** Wasted a debugging cycle initially treating the empty-key state as a
suspected app bug rather than a missing-config state.

**How to apply:** Before investigating "Supabase not working" issues, first
check `.env.local` has non-empty values for both keys. If someone reports
registration/login/DB actions failing, check env config before touching
application code.

Live Supabase project as of 2026-07-08: `sauwkutuutgiaovbkwix` (project ref),
using the newer `sb_publishable_...` key format (works fine with
`@supabase/supabase-js` 2.110.0 / `@supabase/ssr` 0.12.0 — no downgrade
needed). Auth "Confirm email" was disabled in this project's dashboard for
demo purposes, per the README's suggestion — signup now completes instantly
with a session, no email round-trip. Before that toggle, signup hit
Supabase's default email-sending rate limit (`over_email_send_rate_limit`,
HTTP 429) almost immediately on a free-tier project — if signup ever starts
failing again with a generic "No hemos podido crear la cuenta" error, curl the
Supabase `/auth/v1/signup` endpoint directly with the anon key to see the real
error, since `src/app/auth/actions.ts` swallows the underlying Supabase error
message into that one generic string (except for the "already exists" case).
