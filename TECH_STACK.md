# Pokemon Card Authentication Platform — Tech Stack & Architecture

## Overview

A **lean, 100% free** full-stack monorepo. It uses **MongoDB** for document storage, **Next.js** for the frontend, **Express.js** for the API, and **Tesseract.js + Pokemon TCG API** for card identification—all running locally or on free platforms. **Zero AWS, zero paid services.**

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
- **Authentication**: Custom JWT (simple, no external dependencies)
- **Database**: **MongoDB** (document-based, simple schemas, free-tier: MongoDB Atlas or local)
- **File Storage**: **Base64 in MongoDB** (images stored as BSON binary in documents)
- **Validation**: Zod (Shared with frontend)
- **Logging**: Morgan + Winston
- **Testing**: Jest + Supertest

### Database & Storage (MongoDB - 100% Free)
- **Primary Database**: **MongoDB** (free Atlas tier: 512MB storage, or local Docker)
  - Users collection
  - Scans collection (with embedded images as Base64)
  - Reference cards collection (cached from Pokemon TCG API)
  - Simple, no migrations needed
- **File Storage**: **Embedded in MongoDB as Base64/BSON**
  - Images stored directly in scan documents
  - No separate S3 or CDN needed
- **Cache / Job Queue**: **Optional Redis** (via Bull) or simplified inline async using Node.js event emitters

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
- **Frontend (`apps/web`)**: Deploy to **Vercel** (free tier)
- **API Backend (`apps/api`)**: Deploy to **Render.com** or **Railway** (free tier)
- **Database**: **MongoDB Atlas** (free tier: 512MB shared cluster) or **Self-hosted Docker**
- **Total cost**: $0/month (all free tiers)

---

## Security Stack

### Authentication & Authorization
- **Strategy**: Simple JWT-based auth
  - User provides email + password
  - API hashes password with bcrypt, stores in MongoDB
  - On login: verify password, issue JWT token
  - Frontend stores token in localStorage or httpOnly cookie
  - Protected routes validate JWT middleware
- **Dependencies**: `jsonwebtoken`, `bcryptjs` (both free, no external services)
- **IDOR Protection**: All queries scoped by authenticated `userId` from JWT claims

### File Upload Safety
- **Strategy**: Simple Base64 encoding in MongoDB
  - Frontend reads file → Base64 encode → POST to API
  - API validates file size + MIME type
  - Stored as `data.image` in scan document
  - Retrieved by encoding image_id + serving Base64 directly
- **Sanitization**: Sharp (local image processing) re-encodes images to strip EXIF
- **No external storage**: Everything in MongoDB, zero infrastructure overhead

---

## Performance & Scaling (Free Tier Optimization)

- **MongoDB Indexing**: Indexes on `userId`, `status`, `createdAt` for fast queries
- **Image Compression**: Client-side (Compressor.js) reduces image size before upload
- **Base64 Efficiency**: Images are compressed to <500KB before encoding
- **Minimal Dependencies**: Lean stack = fast startup + low memory footprint

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
