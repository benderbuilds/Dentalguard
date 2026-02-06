# CLAUDE.md — Project Configuration

## Project Overview

This is **DentalPilot** (formerly DentalGuard), an AI-powered practice operations platform for dental offices. It combines OSHA/HIPAA compliance management with an AI website chatbot, digital patient intake, Open Dental PMS integration, and practice analytics into a single SaaS product.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **API Layer:** tRPC v11 with React Query v5
- **Database:** Supabase (PostgreSQL + Auth + Row-Level Security + Realtime)
- **Styling:** Tailwind CSS v3
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514) for chatbot conversations
- **PMS Integration:** Open Dental REST API (Remote mode via api.opendental.com/api/v1/)
- **Email:** Resend for transactional emails (morning summaries, notifications)
- **Hosting:** Vercel
- **Widget:** Standalone React component compiled to single JS bundle via Vite

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth pages (login, signup, magic-link)
│   ├── (dashboard)/        # Authenticated dashboard pages
│   │   ├── comply/         # OSHA/HIPAA compliance module
│   │   ├── engage/         # Chatbot config, conversations, analytics
│   │   ├── intake/         # Patient intake forms & submissions
│   │   ├── insights/       # Practice analytics & morning summaries
│   │   └── settings/       # Practice settings, Open Dental config, billing
│   ├── api/                # API routes
│   │   ├── trpc/           # tRPC handler
│   │   ├── chat/           # Chatbot public endpoint (widget talks to this)
│   │   ├── webhooks/       # Open Dental webhooks, Stripe webhooks
│   │   └── cron/           # Vercel Cron (morning summary, sync jobs)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── comply/             # Compliance-specific components
│   ├── engage/             # Chatbot config & conversation components
│   ├── intake/             # Intake form builder & viewer
│   └── shared/             # Shared layout, nav, etc.
├── lib/
│   ├── supabase/           # Supabase client, server client, middleware
│   ├── trpc/               # tRPC client, server, routers
│   ├── ai/                 # Claude API wrapper, system prompts, conversation management
│   ├── open-dental/        # Open Dental API client, types, sync logic
│   ├── email/              # Resend templates & send functions
│   └── utils/              # Shared utilities
├── server/
│   └── routers/            # tRPC routers (comply, engage, intake, insights, settings)
└── types/                  # Shared TypeScript types
widget/                     # Separate Vite project for embeddable chatbot widget
├── src/
│   ├── Widget.tsx          # Main widget component
│   ├── ChatWindow.tsx      # Chat interface
│   └── index.ts            # Entry point, mounts to DOM
├── vite.config.ts          # Builds to single JS bundle
└── package.json
supabase/
└── migrations/             # SQL migration files (ordered by timestamp)
```

## Architecture Principles

1. **Multi-tenant from day one.** Every table has `practice_id` with RLS policies. Never leak data between practices.
2. **The chatbot widget is a separate build artifact.** It compiles to a single `<script>` tag that practices embed on their website. It communicates with our Next.js API routes, NOT directly with Supabase or Open Dental.
3. **Open Dental integration is optional.** The Comply and basic Engage tiers work without Open Dental. The Complete tier adds live scheduling via the Open Dental API.
4. **AI conversations are stateless per request.** Each chatbot message sends the conversation history to Claude. We store conversations in Supabase, not in-memory.
5. **Compliance module is the existing DentalGuard functionality** — training tracker, document repository, inspection packets, onboarding wizard. It stays as-is but gets rebranded.

## Key External APIs

### Open Dental API
- Base URL: `https://api.opendental.com/api/v1/`
- Auth header format: `Authorization: ODFHIR {DeveloperKey}/{CustomerKey}`
- Credentials: stored in environment variables (`OPEN_DENTAL_DEVELOPER_KEY`, per-practice customer keys encrypted in Supabase). See `.env.example` for placeholders.
- Key endpoints: Appointments (GET/POST/PUT), Patients (GET/POST), Operatories (GET), Providers (GET), Schedules (GET), Commlogs (POST), Subscriptions (POST for webhooks)
- Rate limit: 1 req/sec with write permissions
- Cost: $30/location/month billed to us

### Anthropic Claude API
- Model: claude-sonnet-4-20250514
- Used for: chatbot conversations, compliance Q&A
- Each practice gets a custom system prompt with their specific services, providers, hours, insurance panels, and compliance context

## Database Conventions

- All tables use `UUID` primary keys via `gen_random_uuid()`
- All tables include `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()`
- All user-facing tables include `practice_id UUID REFERENCES practices(id) ON DELETE CASCADE`
- RLS is enabled on every table. Policies check `auth.uid()` against practice membership.
- Use Supabase migrations for all schema changes (never edit DB directly)

## Code Conventions

- Use `async/await` everywhere, no `.then()` chains
- tRPC routers go in `src/server/routers/` and are merged in `src/server/routers/_app.ts`
- Use zod for all input validation on tRPC procedures
- Components use named exports, not default exports
- Server-only code uses `"use server"` directive or lives in `src/server/`
- Client components use `"use client"` directive
- Error handling: wrap external API calls (Open Dental, Claude) in try/catch with typed error responses

## Current State (as of Feb 2026)

Resolved issues:
1. ~~tRPC v10 is incompatible with React Query v5~~ — Upgraded to tRPC v11. Removed unused `@trpc/next`.
2. ~~Next.js 14.1.4 has a known security vulnerability~~ — Upgraded to Next.js 15.5.12. Async `cookies()`/`headers()`/`params` APIs updated throughout.
3. ~~Google Fonts (Inter) fails to load~~ — Replaced with local Geist font via `geist` package (`GeistSans` from `geist/font/sans`).

Remaining issues:
4. Supabase migrations may not have been applied to the production database.
5. Tailwind styles may not render until `.next` cache is cleared.

## Testing

- Run `npm run dev` and verify http://localhost:3000 loads with styles
- Test auth flow: signup → verify email → login → dashboard
- Test each module route renders without errors
- For Open Dental integration: use test credentials against OD's sandbox before connecting to real practices
