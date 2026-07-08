# Tasks — current sprint

What we're actively working on. Plan here before building; mark items complete
as we ship. Read this at the start of every session.

## In progress

- [ ] Verify create-community → tablón → vote → acta flow end-to-end locally

## Done

- [x] Install Node 20+ (via nvm, v24) and `npm install` dependencies locally
- [x] Confirm landing page renders correctly at `/`
- [x] Set up dev server launch config (`comunidad-dev`, port 3000)
- [x] Set up memory + lessons + tasks system in this repo, parallel to Rehabilita's
- [x] Wire real Supabase project keys into `.env.local` (project `sauwkutuutgiaovbkwix`)
- [x] Disable "Confirm email" in Supabase auth settings for demo purposes
- [x] Verify registration → login end-to-end locally (signup succeeds, redirects into `/app`)

## Backlog / ideas

- [ ] Confirm `supabase/migrations/0001_init.sql` has been run on the live project (not yet explicitly verified — signup succeeded but no community/vote data has round-tripped yet)
- [ ] Deploy to Vercel (not yet deployed anywhere — local only as of 2026-07-08)
- [ ] Add payments/subscription billing (explicitly out of scope for current build — see README "Notas de diseño y alcance")
