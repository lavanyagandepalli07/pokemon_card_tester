# Pokemon Card Authentication Platform — Tech Stack & Architecture

## Overview

A modern, highly efficient, and **100% free-tier** full-stack monorepo application. It leverages **Next.js** for a Vercel-ready frontend, **Supabase** for managed database, authentication, and file storage, and local **Tesseract.js** + the official **Pokemon TCG API** for card identification and market valuation.

---

## Frontend Stack

### Web Application
- **Framework**: Next.js 14+ (App Router, Server Actions, fully Vercel-compatible)
- **Language**: TypeScript
- **State**: TanStack Query (React Query) + Zustand
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Mobile/Camera**: WebRTC (getUserMedia API) for image capture
- **Auth Interface**: Supabase Auth UI or Custom forms using `@supabase/supabase-js`
- **Build & Hosting**: Next.js (Turbopack) hosted on **Vercel**
- **Testing**: Playwright for E2E, Vitest for unit testing

---

## Backend Stack

### API Server
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: **Supabase Auth** (Tokens verified via JWT bearer middleware inside the Express server using `@supabase/supabase-js`)
- **Database Access**: **Prisma ORM** (Connected to Supabase PostgreSQL database)
- **Validation**: Zod (Shared with frontend)
- **Logging**: Morgan + Winston
- **Testing**: Jest + Supertest

### Database & Storage (Supabase Free Tier)
- **Primary Database**: **Supabase PostgreSQL** (Free tier, fully managed, hosted on AWS, up to 500MB storage).
- **File Storage**: **Supabase Storage** (Free tier, up to 1GB bucket capacity). Used to host card photo uploads via signed upload/download URLs.
- **Cache / Job Queue**: Optional local Redis (via Bull) for queueing or simplified async background processing chains running directly within the Node.js process during development.

---

## AI/ML Stack & Integrations

### Card Text Extraction (OCR)
- **Engine**: **Tesseract.js** (Pure Javascript OCR running locally in the Node.js API/worker environment).
- **Cost**: **$0.00 (100% Free)**. Runs fully local, has zero rate limits, and requires no API keys or credit cards.
- **Features**: Extracts set abbreviations, card name fragments, and card numbers.

### Reference Database & Valuation
- **Provider**: **Pokemon TCG API** (Official [pokemontcg.io](https://pokemontcg.io)).
- **Cost**: **$0.00 (100% Free)**. Basic access is completely free; a free developer API key increases limits to 20,000 requests/day.
- **Features**:
  - Comprehensive metadata lookup (Base Set through current releases).
  - High-fidelity official reference card image URLs.
  - Real-time market prices from TCGPlayer and Cardmarket (satisfies Phase 4 pricing out-of-the-box).

---

## Infrastructure & DevOps (Seamless Serverless Stack)

### Development Environment
- Minimal setup: Next.js + Express API dev servers run concurrently.
- PostgreSQL database, Auth, and Storage are hosted in the cloud for free by Supabase, eliminating complex local database configurations.

### Deployment (Production)
- **Frontend (`apps/web`)**: Deployed directly to **Vercel** with one click.
- **API Backend (`apps/api`)**: Deployed as Vercel Serverless Functions, or on a free/low-cost container service like Render, Railway, or Fly.io.
- **Database, Auth & Storage**: Managed in the cloud on **Supabase**.

---

## Security Stack

### Authentication & Authorization
- **Token Exchange**: Bearer JWT tokens issued by Supabase Auth are sent in the HTTP `Authorization` header.
- **Verification**: The Express backend middleware validates the session by calling Supabase's secure token verification API, guaranteeing only authenticated users access protected routes.
- **IDOR Protection**: Prisma queries are strictly scoped using the authenticated `userId` matched to the Supabase Auth UUID.

### File Upload Safety
- **Direct-to-Bucket**: Frontend uploads directly to Supabase Storage using highly restricted, temporary signed URLs.
- **Sanitization**: Uploaded images are re-encoded and metadata (EXIF) is stripped before card processing.

---

## Performance & Scaling (Free Tier Optimization)

- **Next.js Caching**: Dynamic routes are cached where appropriate to minimize database and API requests.
- **Prisma Connection Pooling**: Configured with direct Supabase connection poolers to handle concurrent serverless requests.
- **Image Optimization**: Uploaded images are scaled down on the client side before submission to minimize storage usage and network bandwidth.

---

## Testing Strategy

- **Unit Tests**: Coverage on schemas, parsers, and custom matching algorithms using Jest/Vitest.
- **Integration Tests**: Verification of JWT token validations, Supabase Storage uploads, and Pokemon TCG API card matching pipelines.
- **E2E Tests**: Playwright scripts simulating user registration, login, card upload, OCR processing, and result viewing.

---

## Phase-by-Phase Technology Rollout

| Phase | Core Stack Elements | Cost |
|-------|---------------------|------|
| **Phase 1 (MVP)** | Next.js (Vercel) + Express + Supabase DB/Auth/Storage + Tesseract.js + Pokemon TCG API | **$0.00** |
| **Phase 2 (CV)** | Local client-side cropping or lightweight OpenCV package | **$0.00** |
| **Phase 3 (AI Auth)** | Python FastAPI service running on free GPU/CPU serving platforms (e.g. Hugging Face, Modal free tier) | **$0.00** |
| **Phase 4 (Pricing)** | Augmented Pokemon TCG API price caching | **$0.00** |
| **Phase 5 (Analytics)** | Free tier Segment / Mixpanel integrations | **$0.00** |
| **Phase 6 (Camera)** | HTML5 getUserMedia browser API | **$0.00** |
