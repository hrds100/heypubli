# HeyPubli — Claude Code Rules

@AGENTS.md

## About this project

**HeyPubli** is a Portuguese-language micro-influencer management platform for Brazil.
Influencers sign up, connect Instagram, and we auto-publish content on their feed/stories
for partner brands. They earn 30% recurring commission per sale via their Hotmart affiliate
link. Admin has full control: schedule posts, manage brands, message influencers, track
sales.

Domain: heypubli.com | Stack: Next.js 16 + Supabase + n8n + Meta Graph API

## User context

Hugo is the owner — **non-technical**. Never assume he knows what a terminal, CLI flag, or
API does. Keep responses short — he can read the diff. Never ask Hugo for credentials —
they are all stored in Claude Code memory.

## TDD — Non-negotiable

1. **Write the test FIRST.** Run it and see it FAIL.
2. **Then write the code.** Run the test and see it PASS.
3. **No exceptions.** Every feature, every component, every utility.
4. Unit tests: Vitest + Testing Library. E2E tests: Playwright.
5. Never claim something works without a passing test.

## Read docs before coding — Non-negotiable

Before implementing ANY integration, you MUST fetch and read the official documentation
URL first. Never guess at API shapes, auth flows, or request formats.

| Service                    | Documentation URL                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Supabase                   | https://supabase.com/docs                                                                  |
| Meta Graph API (Instagram) | https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login |
| Hotmart API                | https://developers.hotmart.com/docs                                                        |
| Unipile (WhatsApp)         | https://developer.unipile.com/docs/whatsapp                                                |
| Resend (Email)             | https://resend.com/docs                                                                    |
| n8n (Automation)           | https://docs.n8n.io                                                                        |
| Next.js 16                 | https://nextjs.org/docs                                                                    |

## Stack

- Next.js 16 (App Router, RSC) + TypeScript strict + React 19
- Tailwind v4 (CSS-first — no `tailwind.config.ts`, tokens live in `app/globals.css`)
- Supabase (Auth + Postgres + Storage + Realtime + Edge Functions)
- Lucide icons, react-hook-form + zod, Framer Motion, Recharts, date-fns
- Vitest + Testing Library (unit) + Playwright (e2e)
- Prettier + ESLint 9 flat config + eslint-plugin-boundaries
- Husky + lint-staged pre-commit

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run Vitest tests
pnpm exec tsc --noEmit # TypeScript check (must pass before commit)
pnpm exec eslint .    # Lint check (must pass before commit)
pnpm exec playwright test # E2E tests
pnpm format           # Prettier format
```

## Modular architecture rules (hard)

1. **Every visual concept = its own folder** under `features/<kebab-case>/`.
   A feature's only public export is `index.ts`. Nothing outside the feature
   may import from its internals.
2. **No cross-feature imports.** If `features/A` needs something from
   `features/B`, lift it to `app/...page.tsx` and compose there.
3. **Zone edges** (enforced by eslint-plugin-boundaries):
   - `app/*` → features, components, lib, mocks, types, schemas, copy
   - `features/*` → components, lib, types, schemas, copy
   - `components/*` → lib, types
   - `lib/*` → types, schemas
   - `mocks/*` → types, schemas
4. **Every feature folder has a README.md** (see `docs/ADDING-A-FEATURE.md`).
5. **Portuguese copy lives in per-feature `copy.ts`.** Global strings in `copy/pt-BR/global.ts`.
6. **Mock data**: per-feature `mock.ts` for tests; canonical dataset in `/mocks/*.mock.ts`.

## PT-BR copy rules

- Always use `você` (not `tu`)
- Imperative CTAs: "Pegue seu link", "Conecte seu Instagram"
- Never use "Bloqueado" — use "Desbloqueie" or "Faltam R$ X"
- All user-facing text in Portuguese (Brazil)

## Design tokens

| Element              | Color                       | Usage                             |
| -------------------- | --------------------------- | --------------------------------- |
| Background           | #FFFFFF                     | Main background                   |
| Background secondary | #F9FAFB                     | Cards, content areas              |
| Accent primary       | #E1306C                     | Buttons, highlights, active icons |
| Accent gradient      | #F56040 → #E1306C → #C13584 | Headers, badges, special CTAs     |
| Text primary         | #1A1A1A                     | Titles, important text            |
| Text secondary       | #6B7280                     | Descriptions, labels              |
| Borders              | #E5E7EB                     | Cards, tables, dividers           |
| Success              | #10B981                     | Connected, published, active      |
| Error                | #EF4444                     | Failed, disconnected, pending     |
| Warning              | #F59E0B                     | Scheduled, expiring, attention    |

## Database (Supabase — 10 tables)

Full schema in `docs/DATABASE-SCHEMA.md`. Tables:
`profiles`, `sectors`, `influencer_sectors`, `instagram_connections`,
`brands`, `brand_assignments`, `scheduled_posts`, `messages_log`,
`hotmart_sales`, `admin_sessions`

## Hard rules (never violate without asking Hugo)

- Never touch `eslint.config.mjs` zone edges without asking.
- Never add a new top-level folder without asking.
- Never install a new dependency without explaining why first.
- Never `git push --force` or `git reset --hard`.
- Never skip hooks with `--no-verify`.
- Always run `pnpm exec tsc --noEmit` before claiming anything is done.
- Always run `pnpm exec eslint .` before committing.
- Every new feature gets a Vitest test FIRST.
- Every new top-level route gets a Playwright smoke spec.
- Read the file before editing it. Never guess at code you haven't opened.
- Never use `sed` to edit .tsx/.ts files — use proper Edit tools.

## Phase state

- **Phase 1 (current):** Project scaffold + all MD files + config
- **Phase 2:** Supabase database setup (10 tables + RLS + seeds)
- **Phase 3:** Auth + 6-step onboarding
- **Phase 4:** Influencer dashboard (Home, Calendar, Analytics, Settings)
- **Phase 5:** Admin dashboard (Overview, Influencers, Scheduler, Messages, Brands, Hotmart, Impersonate)
- **Phase 6:** Backend wiring (real APIs replace mocks)

## Credentials

All stored in Claude Code memory at `~/.claude/projects/-Users-hugo-Whats-mypubli/memory/`.
Check memory BEFORE asking Hugo. Never ask for credentials — they are already saved.
