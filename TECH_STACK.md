# Pokemon Card Authentication Platform — Tech Stack & Architecture

## Overview

Monorepo-based full-stack application designed to handle image uploads, ML inference, and real-time status tracking for Pokemon card authentication.

---

## Frontend Stack

### Web Application
- **Framework**: React 18+ (or Next.js 14+ for SSR/API routes)
- **Language**: TypeScript
- **State**: TanStack Query + Zustand (or Redux Toolkit)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Mobile/Camera**: WebRTC (getUserMedia API)
- **Real-time**: WebSocket / Server-Sent Events (SSE)
- **Build**: Vite or Next.js (Turbopack)
- **Testing**: Vitest + React Testing Library + Playwright E2E

### Key Libraries
- `zustand` or `@reduxjs/toolkit` — state management
- `@tanstack/react-query` — data fetching & caching
- `react-router-dom` — routing (if SPA)
- `zod` — validation (shared with backend)
- `socket.io-client` — real-time updates (if using WebSocket)

---

## Backend Stack

### API Server
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js or Fastify or NestJS
- **Language**: TypeScript
- **Authentication**: JWT + OAuth2 (Auth0 / Okta / Firebase Auth)
- **API Protocol**: GraphQL (optional) or REST
- **Validation**: Zod or Joi
- **Logging**: Winston or Pino
- **Testing**: Jest + Supertest

### Database
- **Primary DB**: PostgreSQL 15+
  - Stores users, scans, collections, pricing snapshots
  - PostGIS extension for spatial queries (if needed)
- **Cache**: Redis 7+ (session store, job queue, real-time counters)
- **Search** (Phase 5+): Elasticsearch or MeiliSearch (for collection search)

### File Storage
- **Uploads**: AWS S3 or GCS (bucket with signed URLs for direct upload)
- **Derivatives**: Same bucket, prefixed by scan ID (sanitized images, heatmaps)
- **CDN**: CloudFront or Cloudflare for cached access

### Job Queue & Async Processing
- **Queue**: Bull Queue (Redis-backed) or AWS SQS
- **Workers**: Node.js workers or Lambda functions
  - OCR processing
  - Model inference (forwarded to GPU workers)
  - Email/alert dispatch

---

## AI/ML Stack

### Core Dependencies
- **OCR**: Tesseract.js (browser) or cloud API (Google Cloud Vision, Azure Computer Vision)
- **Image Processing**: OpenCV (via `opencv4nodejs`) or Python subprocess
- **Deep Learning**: 
  - PyTorch or TensorFlow
  - Model serving: vLLM, Ray Serve, or Triton Inference Server
  - Quantization: ONNX Runtime for CPU inference

### GPU Infrastructure
- **Serving**: Kubernetes cluster or managed service (Modal, Replicate, Lambda)
- **Model Registry**: MLflow or Hugging Face Model Hub
- **Monitoring**: Prometheus + Grafana (for inference latency, queue depth)

### Data Science Tooling
- **Development**: Jupyter, PyTorch, scikit-learn, pandas
- **Evaluation Harness**: Custom Python scripts (Phase 0 baseline)
- **Experiment Tracking**: Weights & Biases or MLflow

---

## Infrastructure & DevOps

### Containerization
- **Docker**: Multi-stage Dockerfiles for web, API, workers
- **Container Registry**: GitHub Container Registry, ECR, or Docker Hub

### Orchestration
- **Development**: Docker Compose
- **Production**: 
  - Kubernetes (EKS, GKE, AKS) for workload scaling
  - Or managed platforms: Vercel (frontend), Railway/Render (backend), AWS Lambda (workers)

### CI/CD
- **Git**: GitHub (mono-repo structure with protected `main`)
- **CI Pipeline**: GitHub Actions
  - Lint (ESLint, Prettier)
  - Type-check (tsc)
  - Unit tests (Jest)
  - Security scan (Dependabot, Snyk)
  - Build & push Docker images
- **Deployment**: GitOps (ArgoCD) or platform-native (Vercel, Railway)

### Monitoring & Observability
- **Logging**: ELK Stack or CloudWatch / Stackdriver
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger or DataDog
- **Alerting**: PagerDuty or Opsgenie
- **Error Tracking**: Sentry

### Infrastructure as Code
- **IaC**: Terraform or AWS CDK
- **Configuration**: Helm (Kubernetes charts)

---

## Security Stack

### Authentication & Authorization
- **Auth Provider**: Auth0, Firebase Auth, or custom JWT
- **RBAC**: Role-based access control (admin, pro, free tiers)
- **Session**: Secure httpOnly cookies + CSRF protection

### Data Security
- **Encryption at Rest**: AWS KMS, GCS CMEK
- **Encryption in Transit**: TLS 1.3
- **Secrets Management**: AWS Secrets Manager, HashiCorp Vault
- **Key Rotation**: Automated quarterly rotation

### WAF & Bot Protection
- **WAF**: AWS WAF or Cloudflare
- **Bot Detection**: Cloudflare Bot Management or reCAPTCHA
- **Rate Limiting**: Redis-based with leaky bucket algorithm

### Scanning & Compliance
- **SAST**: SonarQube or Snyk Code
- **Dependency Scanning**: Dependabot, Snyk
- **Container Scanning**: Trivy
- **Secrets Scanning**: TruffleHog

---

## Performance & Scaling

### Client-Side
- **Bundle Size Target**: <200KB (gzipped) for main app
- **Lighthouse Target**: 85+ (Performance, Best Practices)
- **Mobile Optimization**: Lazy loading, code splitting, adaptive bitrate images

### Server-Side
- **P95 Response Time**: <200ms (API)
- **Database Query**: Query optimization, indexed lookups, caching layer
- **Horizontal Scaling**: Stateless API servers behind load balancer

### GPU Workers
- **Batching**: Accumulate requests, batch process (8–16 images/batch)
- **Model Quantization**: FP16 or INT8 for faster inference
- **Multi-GPU**: Data parallelism across GPUs
- **Autoscaling**: Scale workers based on queue depth (min: 2, max: 20)

---

## Testing Strategy

### Test Pyramid
```
        / \
       / E2E \         (Playwright, WebDriver)
      /-------\
     / Integration\   (Jest + test containers, API+DB)
    /-----------\
   / Unit Tests   \  (Jest, Vitest)
  /_______________\
```

### Testing Coverage Targets
- **Unit Tests**: >80% coverage (critical paths)
- **Integration Tests**: Key APIs, auth, file upload, scan creation
- **E2E Tests**: 
  - Login flow
  - Upload → OCR → match → view result
  - OCR correction + rerun
  - Mobile camera capture (Phase 6)

### Performance Testing
- **Load Tests**: k6 or JMeter (target: 1000 concurrent users)
- **Stress Tests**: Gradual increase to breaking point
- **Soak Tests**: 24–72h at target load

### Security Testing
- **Penetration Testing**: Third-party pentest (Phase 8)
- **Fuzzing**: AFL or libFuzzer on input parsing
- **OWASP Top 10**: Checklist validation

---

## Deployment Pipeline

```
Local Dev (Docker Compose)
  ↓
GitHub PR → CI Pipeline (lint/test/build)
  ↓
Approval + Merge to main
  ↓
Auto-Deploy to Staging
  ↓
Smoke Tests + E2E Tests
  ↓
Manual QA / Metrics Review
  ↓
Production Deployment (Blue-Green or Canary)
  ↓
Monitoring + Rollback Automation
```

---

## Service Architecture (Microservices-Ready)

### Web Service
- Next.js or React SPA
- Serves UI + API routes (BFF pattern)

### API Service
- Core REST/GraphQL server
- User auth, scan CRUD, result queries

### OCR Service
- Dedicated service or subprocess
- Accepts image ROI + metadata
- Returns structured fields

### Model Inference Service
- Python FastAPI or Flask
- Handles authenticity model, condition models
- Separate GPU-optimized instance

### Notification Service
- Sends emails, SMS alerts
- Queued via Redis Bull
- Template engine (Handlebars)

### Data Pipeline Service
- Reference data ingestion
- Price aggregation + caching
- Scheduled jobs (cron)

---

## Development Workflow

### Local Setup
```bash
git clone <repo>
cd pokemon-card-auth

# Install dependencies (monorepo)
npm install

# Start local services (Docker Compose)
docker-compose up -d

# Run dev servers
npm run dev              # Web + API dev server
npm run ai:dev          # Python AI service (if local)

# Run tests
npm run test            # All tests
npm run test:e2e        # E2E only
```

### Monorepo Structure
```
pokemon-card-auth/
├── packages/
│   ├── shared-types/        # TypeScript types + zod schemas
│   ├── ui-components/       # Shared React components
│   └── sdk/                 # Client SDK
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # Express API server
│   ├── workers/             # Bull queue workers
│   └── ai/                  # Python AI services (FastAPI)
├── infra/                   # Terraform / IaC
├── tests/                   # Shared E2E + integration tests
├── docker-compose.yml
├── tsconfig.base.json
└── package.json
```

---

## Cost Optimization

### Phase 1 (MVP)
- Managed PostgreSQL (AWS RDS or Neon)
- Single API instance (t3.medium)
- Single GPU instance (g4dn.xlarge, ~$0.35/hr)
- S3 storage (est. $5–10/month for dev)

### Phase 8 (Production)
- Kubernetes cluster (EKS) or managed container service
- Auto-scaled GPU workers (2–20 instances)
- Multi-AZ database with read replicas
- CDN for derivatives
- Estimated monthly cost: $2K–5K (depending on traffic)

---

## Version Pinning & Updates

- **Node.js**: Lock to LTS version (e.g., 20.x)
- **Dependencies**: Use `package-lock.json` (npm) or `yarn.lock`
- **Python**: Lock ML dependencies in `requirements.lock` or `poetry.lock`
- **Docker Base Images**: Pin to specific digest (not `latest`)
- **Database**: Upgrade strategy documented (Phase 1)

---

## Disaster Recovery & Backup

- **Database Backup**: Daily snapshots (AWS RDS automated backups)
- **File Storage**: S3 versioning enabled; lifecycle policy for old objects
- **Secrets Rotation**: Quarterly; automated via CI/CD
- **DR Drill**: Monthly restore test (Phase 8)
- **RTO Target**: 4 hours
- **RPO Target**: 1 hour

---

## Phase-by-Phase Tech Decisions

| Phase | Key Tech Additions |
|-------|-------------------|
| Phase 1 | PostgreSQL, Redis, S3, Auth0, Node.js API |
| Phase 2 | OpenCV4Nodejs (image processing) |
| Phase 3 | PyTorch model serving, GPU infrastructure |
| Phase 4 | MeiliSearch or Elasticsearch (optional) |
| Phase 5 | Analytics (Segment/Mixpanel), export (PDF generation) |
| Phase 6 | WebRTC (camera), SSE/WebSocket (real-time updates) |
| Phase 7 | Advanced ML (condition classifiers), GPU batching |
| Phase 8 | Kubernetes, multi-region failover, comprehensive monitoring |
