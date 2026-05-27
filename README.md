# Getting Started: Pokemon Card Authentication Platform

**Welcome!** This guide will help you understand the project structure and get oriented quickly using our **100% Free & Seamless API Stack**.

---

## 📋 What Is This Project?

A **full-stack web application** that helps collectors authenticate and valuate Pokémon cards using:
- 📸 Image uploads (stored securely in **Supabase Storage**)
- 🔍 OCR text extraction (running locally via **Tesseract.js** — 100% free)
- 🤖 Card reference identification & market prices (powered by the free **Pokemon TCG API**)
- ✅ Authenticity detection (Phase 3+)
- 💰 Market valuation (Phase 4+)

**Target Users**:
- Casual collectors (free tier) → basic ID + OCR + match
- Serious collectors (pro tier) → authenticity analysis + grading estimates + portfolio tracking

---

## 📁 Documentation Map

| File | Purpose |
|------|---------|
| [PRD.md](PRD.md) | Product roadmap (8 phases) |
| [TECH_STACK.md](TECH_STACK.md) | Technology decisions + updated free architecture |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Directory layout + naming conventions |
| [PHASE_1_TRACKING.md](PHASE_1_TRACKING.md) | MVP tasks + checklist |

---

## 🚀 Quick Start (Local Development)

Because we use a modern serverless-ready free API stack, local setup is incredibly simple. No AWS accounts, credit cards, or Docker containers are required to start developing!

### Prerequisites
- **Node.js** 20+ (LTS)
- **npm** 10+
- **Supabase Account** (Free tier)
- **Git**

### Setup (5 minutes)

```bash
# 1. Clone the repo
git clone <repo-url>
cd pokemon-card-auth

# 2. Install dependencies (monorepo workspaces)
npm install

# 3. Copy environment template
cp .env.example .env.local
# Open .env.local and fill in your free Supabase URL, Anon Key, and Service Role Key.
```

### Apply Schema & Dev Server
Verify Prisma communicates with your database and spin up the frontend and API servers:

```bash
# 4. Push database schema to Supabase Postgres
npx prisma db push

# 5. Start Next.js (frontend) and Express (backend API) dev servers
npm run dev
```

### Service Map
```
✅ Next.js Frontend → http://localhost:3000 (Vercel Ready)
✅ Express API Server → http://localhost:3001 (Verifies Supabase JWTs)
✅ Database & Storage → Managed via Supabase cloud
✅ OCR Engine        → Local execution via Tesseract.js (free)
✅ Reference Cards   → Fetched via pokemontcg.io (free)
```

---

## 🏗️ Project Structure

```
pokemon-card-auth/
│
├── apps/
│   ├── web/           ← Next.js frontend (Tailwind + Shadcn/ui)
│   ├── api/           ← Express API server (Prisma ORM)
│   ├── workers/       ← Background job workers (OCR, match)
│   └── ai/            ← Python ML service (FastAPI)
│
├── packages/
│   ├── shared-types/  ← TypeScript types (Zod validations)
│   ├── ui-components/ ← Reusable React components
│   └── sdk/           ← API client library
```

---

## 📖 Key Services in Phase 1

1. **Authentication**: Handled via **Supabase Auth**. Next.js frontend handles secure user sign-ups and logins, and passes the Supabase session token (JWT) to the Express API backend in the HTTP `Authorization` header (`Bearer <token>`).
2. **Database & Storage**: Powered by **Supabase**. Tables are modeled via Prisma (`apps/api/prisma/schema.prisma`). Raw card images are hosted in Supabase Storage buckets via secure, temporary signed upload URLs.
3. **Local OCR (Tesseract.js)**: Performs local image text extraction directly inside our Node.js background environment. Highly developer-friendly, zero rate limits, and 100% free.
4. **Reference Lookup (Pokemon TCG API)**: Cards are automatically identified by querying the official Pokemon TCG API, returning complete card metadata and market pricing.

---

## 🧪 Running Tests

```bash
# Run unit and integration tests across workspaces
npm run test

# Run E2E tests (Playwright)
npm run test:e2e
```

---

## 🔐 Security Considerations

- **Authentication**: Bearer JWT validation in the API middleware via Supabase's secure token verification (`supabase.auth.getUser()`).
- **File Upload**: Direct secure uploads using Supabase Storage signed URLs, followed by API sanitization.
- **SQL Injection**: Parameterized database queries enforced by Prisma.
- **Secrets Management**: Secrets are stored in `.env.local` which is globally ignored by Git. Never commit production keys.

---

## 📊 Key Metrics & Success Criteria

### Phase 1 (MVP) Targets
- **OCR Accuracy**: >90% on clean images
- **Match Accuracy**: >85% on reference set
- **Scan Completion Rate**: >95%
- **P95 Scan Time**: <30s

---

## 🤝 Contributing

### Branch Strategy
- `main` → Production (protected)
- `develop` → Integration (staging)
- `feature/*` → Feature work

### Before Pushing
```bash
npm run lint
npm run format
npm run type-check
```

**Happy coding!** 🚀
