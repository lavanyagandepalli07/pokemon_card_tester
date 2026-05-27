# Project Structure & Directory Layout

## Monorepo Root Structure

```
pokemon-card-auth/
│
├── 📁 apps/                          # Runnable applications
│   ├── web/                          # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/                  # Next.js app directory (route tree)
│   │   │   ├── components/           # UI components
│   │   │   ├── features/             # Feature-specific logic
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── lib/                  # Utilities, API client
│   │   │   └── styles/               # Global styles
│   │   ├── public/                   # Static assets
│   │   ├── .env.local                # Local environment variables
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                          # Express/Fastify backend
│   │   ├── src/
│   │   │   ├── routes/               # API endpoints
│   │   │   │   ├── auth.ts           # Login, logout, session
│   │   │   │   ├── scans.ts          # Scan CRUD
│   │   │   │   ├── uploads.ts        # Upload URL signing
│   │   │   │   ├── results.ts        # Result queries
│   │   │   │   └── users.ts          # User profile
│   │   │   ├── middleware/           # Auth, error handling, logging
│   │   │   ├── services/             # Business logic
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── scan.service.ts
│   │   │   │   ├── ocr.service.ts
│   │   │   │   └── storage.service.ts
│   │   │   ├── models/               # Database models (Prisma, Typeorm)
│   │   │   ├── db/                   # Database setup, migrations
│   │   │   ├── lib/                  # Utilities
│   │   │   └── index.ts              # Entry point
│   │   ├── tests/                    # API tests
│   │   ├── .env.local                # Local environment variables
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── workers/                      # Bull Queue workers (Node.js)
│   │   ├── src/
│   │   │   ├── jobs/
│   │   │   │   ├── ocr.job.ts        # OCR processing
│   │   │   │   ├── inference.job.ts  # Model inference dispatch
│   │   │   │   └── email.job.ts      # Email dispatch
│   │   │   ├── config/
│   │   │   └── index.ts              # Worker server startup
│   │   └── package.json
│   │
│   └── ai/                           # Python AI service (FastAPI)
│       ├── src/
│       │   ├── models/               # Model inference code
│       │   │   ├── authenticity.py
│       │   │   ├── condition.py
│       │   │   └── loaders.py        # Model loading & caching
│       │   ├── routes/               # FastAPI routes
│       │   │   └── inference.py
│       │   ├── utils/                # Image processing, normalization
│       │   └── main.py               # FastAPI app
│       ├── requirements.txt
│       ├── requirements-lock.txt     # Locked dependencies
│       ├── Dockerfile
│       └── .env.local
│
├── 📁 packages/                      # Shared libraries & utilities
│   ├── shared-types/                 # TypeScript types + Zod schemas
│   │   ├── src/
│   │   │   ├── index.ts              # Re-exports
│   │   │   ├── auth.ts               # Auth schemas
│   │   │   ├── scan.ts               # Scan + result types
│   │   │   ├── user.ts               # User types
│   │   │   └── api.ts                # API response envelopes
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui-components/                # Reusable React components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Form/
│   │   │   └── index.ts              # Re-exports
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── sdk/                          # Frontend API client SDK
│       ├── src/
│       │   ├── index.ts
│       │   ├── client.ts             # HTTP client wrapper
│       │   ├── auth.ts               # Auth API methods
│       │   ├── scans.ts              # Scan API methods
│       │   └── uploads.ts            # Upload API methods
│       ├── tsconfig.json
│       └── package.json
│
├── 📁 infra/                         # Infrastructure as Code
│   ├── terraform/                    # Terraform modules
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── aws/
│   │   │   ├── eks.tf                # Kubernetes cluster
│   │   │   ├── rds.tf                # PostgreSQL
│   │   │   ├── s3.tf                 # File storage
│   │   │   └── iam.tf                # Roles + policies
│   │   └── modules/
│   │       ├── network/
│   │       └── monitoring/
│   │
│   ├── kubernetes/                   # Helm charts
│   │   ├── api-server/
│   │   ├── worker/
│   │   ├── ai-service/
│   │   └── monitoring/
│   │
│   └── scripts/                      # Setup & deployment scripts
│       ├── bootstrap.sh              # First-time setup
│       ├── deploy.sh                 # CI/CD deployment
│       └── restore-db.sh             # DR script
│
├── 📁 tests/                         # Shared test suites
│   ├── e2e/                          # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   ├── upload.spec.ts
│   │   ├── scan.spec.ts
│   │   └── fixtures/                 # Test data, fixtures
│   │
│   ├── integration/                  # API + DB integration tests
│   │   ├── auth.test.ts
│   │   └── scans.test.ts
│   │
│   └── fixtures/
│       ├── test-images/              # Sample card images
│       └── golden-results/           # Expected outputs
│
├── 📁 docs/                          # Documentation
│   ├── API.md                        # API reference
│   ├── ARCHITECTURE.md               # System design
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── CONTRIBUTING.md               # Dev contribution guidelines
│   └── SECURITY.md                   # Security practices
│
├── 📁 .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, test, build
│   │   ├── deploy.yml                # Deploy to staging/prod
│   │   └── security.yml              # Dependency scans
│   └── ISSUE_TEMPLATE/
│
├── 📁 .docker/                       # Shared Docker configurations
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.worker
│   └── Dockerfile.ai
│
├── 📄 docker-compose.yml             # Local dev environment
├── 📄 .env.example                   # Example environment variables
├── 📄 .gitignore
├── 📄 .eslintrc.json                 # Shared ESLint config
├── 📄 .prettierrc.json               # Shared Prettier config
├── 📄 tsconfig.base.json             # Shared TypeScript config
├── 📄 package.json                   # Monorepo root (workspaces)
├── 📄 package-lock.json
├── 📄 pnpm-workspace.yaml            # If using pnpm
├── 📄 turbo.json                     # Turbo build orchestration
│
├── 📄 PRD.md                         # Product requirements document
├── 📄 TECH_STACK.md                  # Technology decisions
├── 📄 PROJECT_STRUCTURE.md           # This file
├── 📄 ROADMAP.md                     # Phase-by-phase timeline
├── 📄 README.md                      # Getting started
│
└── 📄 .gitmodules                    # (if using Git submodules)
```

---

## Configuration Files

### Root `package.json` (Monorepo Workspaces)

```json
{
  "name": "pokemon-card-auth",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.12.0",
    "typescript": "^5.3.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### Environment Variables Template (`.env.example`)

```env
# DATABASE
DATABASE_URL=postgresql://user:password@localhost:5432/pokemon_card_auth

# REDIS
REDIS_URL=redis://localhost:6379

# AWS / STORAGE
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET_NAME=pokemon-card-uploads

# AUTH
AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
AUTH0_CLIENT_ID=xxxxx
AUTH0_CLIENT_SECRET=xxxxx
JWT_SECRET=dev-secret-change-in-prod

# API
API_URL=http://localhost:3000
API_PORT=3001

# WEB
NEXT_PUBLIC_API_URL=http://localhost:3001

# PYTHON AI SERVICE
AI_SERVICE_URL=http://localhost:8000
AI_MODEL_PATH=/models

# FEATURES (flags for Phase rollout)
FEATURE_AUTHENTICITY=false
FEATURE_CONDITION=false
```

---

## Key Files by Phase

### Phase 1 (MVP) — Critical Path

```
✅ PHASE 1 SETUP REQUIRED:
├── apps/api/src/models/                  # Scan, User, Result schema
├── apps/api/src/routes/
│   ├── auth.ts                           # Login/logout
│   ├── uploads.ts                        # Signed URL endpoint
│   └── scans.ts                          # Scan CRUD
├── apps/web/src/pages/
│   ├── login.tsx                         # Auth page
│   ├── upload.tsx                        # Upload + progress
│   └── results/[scanId].tsx              # Result display
├── packages/shared-types/src/
│   ├── scan.ts                           # Scan + Result types
│   └── auth.ts                           # User + Session types
├── .github/workflows/ci.yml              # CI pipeline
└── docker-compose.yml                    # Local dev stack
```

### Phase 2 (Image Processing)

```
🔄 PHASE 2 ADDITIONS:
├── apps/workers/src/jobs/
│   └── image-preprocess.job.ts           # Crop/warp/rotate
├── apps/ai/src/models/
│   └── processor.py                      # OpenCV preprocessing
└── apps/api/src/routes/
    └── quality-check.ts                  # Quality signals API
```

### Phase 3 (Authenticity)

```
🔐 PHASE 3 ADDITIONS:
├── apps/ai/src/models/
│   ├── authenticity.py                   # Embedding + scoring
│   ├── heuristics.py                     # Border/text/color checks
│   └── explainability.py                 # Grad-CAM, heatmaps
├── apps/api/src/routes/
│   └── authenticity.ts                   # Authenticity API
└── apps/web/src/features/
    └── authenticity-report/              # Premium report UI
```

### Phase 6 (Mobile)

```
📱 PHASE 6 ADDITIONS:
├── apps/web/src/features/
│   └── camera-capture/
│       ├── useCameraCapture.ts           # Camera hook
│       └── CameraOverlay.tsx             # Overlay component
└── apps/api/src/services/
    └── realtime.service.ts               # SSE/WebSocket setup
```

---

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities/Services**: camelCase (e.g., `authService.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE.ts`)
- **Types**: PascalCase with `.ts` (e.g., `Scan.ts`, `User.ts`)
- **Routes**: kebab-case (e.g., `/scan-history`, `/results/:scanId`)

### Database Tables
- **Tables**: snake_case, plural (e.g., `users`, `scan_results`, `reference_cards`)
- **Columns**: snake_case (e.g., `user_id`, `created_at`, `match_confidence`)
- **Foreign Keys**: `{table}_id` (e.g., `user_id`, `scan_id`)

### Environment Variables
- **Public (frontend)**: `NEXT_PUBLIC_*` prefix
- **API Keys**: Never in `.env`, use secrets manager in production
- **Sensitive Data**: Never committed; use `.env.local` (in `.gitignore`)

---

## Building & Running Locally

### Prerequisites
```bash
node -v  # v20+
npm -v   # v10+
docker --version
docker-compose --version
```

### Setup
```bash
# Clone repo
git clone <repo-url>
cd pokemon-card-auth

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with local values (auth credentials, etc.)

# Start Docker services (PostgreSQL, Redis)
docker-compose up -d

# Run migrations
npm run db:migrate

# Start dev servers (in parallel)
npm run dev
```

### Output
```
✔️ Web running on http://localhost:3000
✔️ API running on http://localhost:3001
✔️ AI service running on http://localhost:8000
```

---

## Deployment Directories

### Staging
```
/opt/pokemon-card-staging/
├── docker-compose.staging.yml
├── .env.staging
└── data/
    ├── postgres/
    └── redis/
```

### Production
```
/opt/pokemon-card-prod/
├── kubernetes/
│   ├── namespaces.yaml
│   ├── deployments/
│   ├── services/
│   └── configmaps.yaml
├── terraform.tfstate
└── backups/
```

---

## Git Workflow

### Branch Strategy (Git Flow variant)
- `main` — Production-ready code (protected, requires PR review + CI pass)
- `develop` — Integration branch for features (staging deploys)
- `feature/*` — Feature branches (from `develop`, PR to `develop`)
- `hotfix/*` — Production fixes (from `main`, PR to `main` + `develop`)

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

Closes #<issue-number>
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

**Example**:
```
feat(auth): add OAuth login via Auth0

- Integrate Auth0 SDK
- Add login endpoint
- Implement session middleware

Closes #42
```

---

## Next Steps

1. **Create monorepo scaffold** → Use `create-next-app`, `npm init`, scaffold manually
2. **Set up CI/CD** → Configure GitHub Actions workflows
3. **Database schema** → Prisma/TypeORM migrations
4. **Mock APIs** → Stub endpoints for frontend dev parallelism
5. **E2E test fixtures** → Create test data + images
