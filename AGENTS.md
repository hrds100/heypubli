<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# HeyPubli — Agent Definitions

## feature-builder

Creates a new feature folder under `features/<name>/` with all required files.

**When to use:** Every time a new UI feature is needed.

**Steps:**

1. Create `features/<name>/` folder
2. Create `index.ts` (public barrel export)
3. Create main component `<Name>.tsx`
4. Create `<Name>.test.tsx` (Vitest — write FIRST, before the component)
5. Create `copy.ts` (PT-BR strings)
6. Create `mock.ts` (test data)
7. Create `README.md` (use template from `docs/ADDING-A-FEATURE.md`)
8. Run test — confirm it fails
9. Implement component
10. Run test — confirm it passes
11. Run `pnpm exec tsc --noEmit` and `pnpm exec eslint .`

## supabase-migrator

Writes and runs Supabase SQL migrations.

**When to use:** Any database schema change.

**Steps:**

1. Read Supabase docs first: https://supabase.com/docs
2. Create migration file in `supabase/migrations/`
3. Include RLS policies in the same migration
4. Update `types/database.ts` to match new schema
5. Update `schemas/` Zod validators if affected
6. Run `pnpm exec tsc --noEmit` to verify types

## playwright-e2e

Writes and runs Playwright e2e tests for routes.

**When to use:** Every new top-level route or user flow.

**Steps:**

1. Create test in `tests/e2e/<route-name>.spec.ts`
2. Write the test FIRST (TDD)
3. Run `pnpm exec playwright test <file>` — see it fail
4. Implement the route/feature
5. Run test again — see it pass

## doc-reader

Fetches and reads official API documentation before any integration work.

**When to use:** Before writing ANY code that calls an external API.

**Steps:**

1. Fetch the official documentation URL from the table in CLAUDE.md
2. Read and understand auth flow, endpoints, rate limits, error codes
3. Summarize key points relevant to the implementation
4. Only then proceed to write code
