---
name: project-origin-and-scope
description: Comunidad is a pivot from Rehabilita — a governance/voting platform for comunidades de propietarios, not a grant-compliance tool
metadata:
  type: project
---

**Comunidad** is a pivot away from the prior project, **Rehabilita** (an
agente-rehabilitador grant-compliance tool, tracked separately in the
`cc_fundamentals` workspace). Comunidad is a different product: a platform for
a *comunidad de propietarios* (homeowners' association) to communicate, decide,
and vote transparently.

Two parts, per the README:
1. **Marketing site** (`/`) — Spanish-language landing page, mobile-first, with
   a "Solicitar acceso" lead-capture form that writes to Supabase table
   `access_requests`. No payment — CTA is pilot access request only.
2. **Product demo** (`/app`) — working governance product: signup/login,
   create/join a community by invite code, message board (tablón), proposals
   with Sí/No/Abstención voting and live tallies, and auto-generated **actas**
   (minutes) when a vote closes.

Stack: Next.js 16 (App Router) + Tailwind v4 + Supabase (Postgres, auth, RLS).
Schema/RLS/functions live in `supabase/migrations/0001_init.sql` — tables:
`access_requests`, `profiles`, `communities`, `community_members`, `posts`,
`proposals`, `votes`, `actas`. `SECURITY DEFINER` functions
(`is_member`, `create_community`, `join_community`, `close_proposal`) avoid RLS
recursion and handle joining by code.

**Why:** Konark pivoted from Rehabilita to Comunidad by 2026-07-08. Rehabilita's
memory/PRD describe the prior direction and should not be treated as active.

**How to apply:** Treat this as the live product. For historical context on the
prior pivot away from Rehabilita, see that project's own memory system in
`cc_fundamentals/memory/project_pivot-to-comunidad.md`.
