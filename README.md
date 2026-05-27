# Getting Started: Pokemon Card Authentication Platform

**Welcome!** This guide will help you understand the project structure and get oriented quickly.

---

## 📋 What Is This Project?

A **full-stack web application** that helps collectors authenticate and valuate Pokémon cards using:
- 📸 Image uploads (secure, direct to S3)
- 🔍 OCR (extract card text automatically)
- 🤖 ML matching (identify card reference)
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
| [TECH_STACK.md](TECH_STACK.md) | Technology decisions + architecture |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Directory layout + naming conventions |
| [PHASE_1_TRACKING.md](PHASE_1_TRACKING.md) | MVP tasks + checklist |

**Start here**: Read [PRD.md](PRD.md) for full product vision.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** 20+ (LTS)
- **npm** 10+
- **Docker** + **Docker Compose** (for PostgreSQL, Redis)
- **Git**

### Setup (5 minutes)

```bash
# 1. Clone the repo
git clone <repo-url>
cd pokemon-card-auth

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start Docker services
docker-compose up -d

# 5. Run migrations (when DB schema exists)
npm run db:migrate

# 6. Start dev servers (parallel)
npm run dev
```

### What's Running?
```
✅ Web Frontend    → http://localhost:3000
✅ API Server      → http://localhost:3001
✅ PostgreSQL      → localhost:5432
✅ Redis           → localhost:6379
```

---

## 🏗️ Project Structure

```
pokemon-card-auth/
│
├── apps/
│   ├── web/           ← React frontend (Next.js)
│   ├── api/           ← Express backend
│   ├── workers/       ← Job queue (Bull + Redis)
│   └── ai/            ← Python ML service (FastAPI)
│
├── packages/
│   ├── shared-types/  ← TypeScript types (Zod)
│   ├── ui-components/ ← Reusable React components
│   └── sdk/           ← API client library
│
├── infra/             ← Terraform, Helm, scripts
├── tests/             ← E2E + integration tests
└── docs/              ← Architecture, deployment guides
```

**More details**: See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 📖 Understanding the Phases

### Phase 0 — Definition (Design, Risk Assessment)
- [ ] PRD + UX validated
- [ ] Threat model + privacy plan
- [ ] AI feasibility tested

### Phase 1 — MVP (8-12 weeks)
**What**: Upload → OCR → Identify → Basic Report
- User signup/login
- Card image upload (secure, direct to S3)
- Automatic text extraction (OCR)
- Reference matching (identify card)
- Scan history dashboard
- Result viewing page

**Success**: >90% OCR accuracy, >85% match accuracy on test set

### Phase 2 — Image Quality (4-6 weeks)
- Card boundary detection + perspective correction
- Blur/glare detection + recapture guidance
- Pipeline versioning + artifact storage

### Phase 3 — Authenticity (8-12 weeks)
- Forensic heuristics (borders, text, colors)
- ML-based similarity + calibration
- Explainability (heatmaps, evidence)

### Phase 4 → Phase 8
See [PRD.md](PRD.md) for full roadmap details.

---

## 🧪 Running Tests

```bash
# All tests (unit + integration)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Specific workspace
npm run --workspace=apps/api test

# Watch mode
npm run test -- --watch
```

---

## 🔧 Common Development Tasks

### Add a new API route

1. Create route file: `apps/api/src/routes/my-feature.ts`
2. Export handler function
3. Register in `apps/api/src/index.ts`

**Example**:
```typescript
// apps/api/src/routes/my-feature.ts
export const getFeature = async (req, res) => {
  const { id } = req.params;
  // logic here
  res.json({ feature: data });
};

// apps/api/src/index.ts
import { getFeature } from './routes/my-feature';
app.get('/api/features/:id', getFeature);
```

### Add a new React component

1. Create component: `apps/web/src/components/MyComponent.tsx`
2. Export from `apps/web/src/components/index.ts` (if shared)
3. Import + use in pages/other components

**Example**:
```typescript
// apps/web/src/components/ScanCard.tsx
export function ScanCard({ scan }) {
  return <div>Scan: {scan.id}</div>;
}

// apps/web/src/app/dashboard/page.tsx
import { ScanCard } from '@/components';
export default function Dashboard() {
  return <ScanCard scan={...} />;
}
```

### Add a shared type

1. Edit `packages/shared-types/src/scan.ts` (or create new file)
2. Export type + Zod schema
3. Import in frontend/backend as needed

**Example**:
```typescript
// packages/shared-types/src/scan.ts
import { z } from 'zod';

export const ScanSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed']),
});

export type Scan = z.infer<typeof ScanSchema>;
```

---

## 🔐 Security Considerations

- **Authentication**: JWT tokens in httpOnly cookies (configurable)
- **File Upload**: MIME type validation + re-encoding (strip metadata)
- **SQL Injection**: Parameterized queries (Prisma/TypeORM)
- **CORS**: Configured by origin in env vars
- **Rate Limiting**: Redis-backed leaky bucket algorithm
- **Environment Secrets**: Never commit `.env.local`; use `.env.example` template

**Important**: See [TECH_STACK.md](TECH_STACK.md#security-stack) for comprehensive security strategy.

---

## 📊 Key Metrics & Success Criteria

### Phase 1 (MVP) Targets
| Metric | Target |
|--------|--------|
| OCR Accuracy | >90% on clean images |
| Match Accuracy | >85% on reference set |
| Scan Completion Rate | >95% |
| P95 Scan Time | <30s |
| Uptime | 99.5% |

### How to Track
- **CI Dashboards**: GitHub Actions (lint, test, build)
- **E2E Results**: Test reports in `tests/e2e/` after runs
- **Performance**: Synthetic monitoring (k6 load tests)

---

## 🐛 Troubleshooting

### Services won't start
```bash
# Check Docker services
docker-compose ps

# Restart
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs postgres  # or redis, etc.
```

### TypeScript errors
```bash
# Regenerate types
npm run type-check

# Clear cache
rm -rf node_modules/.cache
npm install
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it (if safe)
kill -9 <PID>
```

### Database connection issues
```bash
# Verify PostgreSQL is running
docker exec <postgres-container-id> psql -U user -d pokemon_card_auth -c "SELECT 1"

# Run migrations
npm run db:migrate

# Seed test data (if available)
npm run db:seed
```

---

## 📚 Learning Resources

### Frontend Stack
- **React**: https://react.dev
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Backend Stack
- **Express.js**: https://expressjs.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Redis**: https://redis.io/docs
- **Prisma ORM**: https://www.prisma.io/docs (or TypeORM, Sequelize)

### DevOps & Infrastructure
- **Docker**: https://docs.docker.com
- **Kubernetes**: https://kubernetes.io/docs (Phase 8)
- **Terraform**: https://www.terraform.io/docs

### ML/AI Stack (Phase 3+)
- **PyTorch**: https://pytorch.org/tutorials
- **FastAPI**: https://fastapi.tiangolo.com
- **OpenCV**: https://docs.opencv.org

---

## 🤝 Contributing

### Branch Strategy
- `main` → Production (protected)
- `develop` → Integration (staging deploys)
- `feature/*` → Feature work (PR to develop)

### Before Pushing
```bash
# Lint + format
npm run lint
npm run format

# Type check
npm run type-check

# Test
npm run test
npm run test:e2e
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

Closes #<issue-number>
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

---

## 📞 Getting Help

1. **Check existing docs** → [PRD.md](PRD.md), [TECH_STACK.md](TECH_STACK.md)
2. **Search GitHub issues** → Look for similar problems
3. **Ask in team chat** → Slack/Discord channel
4. **File an issue** → Include error log + reproduction steps

---

## 🎯 Next Steps

1. **Set up local environment** → Follow "Quick Start" above
2. **Read the PRD** → Understand product vision
3. **Review Phase 1 tasks** → See [PHASE_1_TRACKING.md](PHASE_1_TRACKING.md)
4. **Pick a story to work on** → Start with Epic 1.1 (monorepo) or 1.2 (auth)
5. **Create a feature branch** → `git checkout -b feature/epic-1-1`
6. **Build + test** → Push frequently, run tests before PR

---

## 📝 Useful Commands

```bash
# Development
npm run dev                    # Start all services
npm run --workspace=apps/api dev  # Start single service

# Testing
npm run test                   # All tests
npm run test:e2e              # E2E only
npm run test:watch            # Watch mode

# Linting & Formatting
npm run lint                   # ESLint check
npm run format                # Prettier format

# Building
npm run build                  # Build all workspaces
npm run build --workspace=apps/web  # Build single

# Database
npm run db:migrate            # Run migrations
npm run db:seed              # Seed test data
npm run db:reset             # Reset (dev only)

# Docker
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs           # View logs
```

---

## 📅 Project Timeline

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| **0** | 2-4 weeks | PRD + risk burn-down |
| **1** | 8-12 weeks | MVP (upload → OCR → identify) |
| **2** | 4-6 weeks | Image quality gates |
| **3** | 8-12 weeks | Authenticity detection |
| **4** | 4-8 weeks | Rarity + valuation |
| **5-8** | TBD | Advanced features + scale |

**Current Status**: Phase 0 (Design phase)

---

## ✅ Checklist Before First PR

- [ ] Cloned repo + installed dependencies
- [ ] Can run `npm run dev` without errors
- [ ] Can run `npm run test` without errors
- [ ] Reviewed [PRD.md](PRD.md) + [TECH_STACK.md](TECH_STACK.md)
- [ ] Understand project structure (monorepo layout)
- [ ] Have a feature/story assigned (or picked one to start)
- [ ] Read CONTRIBUTING guidelines
- [ ] Set up IDE (VS Code) with ESLint + Prettier extensions

---

**Happy coding!** 🚀

For questions or feedback, see the team's project management board or create a GitHub issue.
