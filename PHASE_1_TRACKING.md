# Phase 1 — Foundation MVP: Task Tracking & Checklist

**Phase Goal**: Build end-to-end scan pipeline (Upload → OCR → Identify → Basic Report)

**Target Duration**: 8-12 weeks  
**Start Date**: TBD  
**Key Milestone**: MVP feature-complete & tested

---

## EPIC 1.1 — Monorepo + Core Tooling

### Story: Create monorepo skeleton (web, services, packages, infra)

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Monorepo structure created with web, api, workers, ai directories
- [ ] Shared types package (`packages/shared-types`) with Zod schemas
- [ ] Root `package.json` with workspaces configured
- [ ] TypeScript config shared (`tsconfig.base.json`)
- [ ] ESLint + Prettier configured across workspace
- [ ] Docker Compose local dev environment (PostgreSQL, Redis)
- [ ] CI pipeline template created (GitHub Actions)

**Tasks**:
- [ ] Initialize monorepo root with npm/pnpm workspaces
- [ ] Create Next.js app in `apps/web` with TypeScript
- [ ] Create Express API in `apps/api` with TypeScript
- [ ] Create `packages/shared-types` with initial schemas
  - [ ] Auth types (User, Session)
  - [ ] Scan types (Scan, ScanResult)
  - [ ] API response envelopes
- [ ] Set up Prettier + ESLint shared configs
- [ ] Create `docker-compose.yml` with PostgreSQL 15, Redis 7
- [ ] Create GitHub Actions CI workflow
  - [ ] Lint step (ESLint)
  - [ ] Type-check step (tsc)
  - [ ] Build step
- [ ] Create `.env.example` with all required variables
- [ ] Document monorepo workflow in `CONTRIBUTING.md`

**Tests**:
- [ ] Unit: N/A (scaffold only)
- [ ] Integration: N/A
- [ ] E2E: Manual verification — repo builds locally, shared types resolve

**Acceptance Criteria**:
- [ ] `npm run dev` starts all services without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] GitHub Actions workflow runs on PR

**Blockers/Dependencies**: None

---

## EPIC 1.2 — Authentication + User System

### Story: Implement auth (email/OAuth) + sessions

**Complexity**: High | **Story Points**: 21

**DoD**:
- [ ] User sign-up & login implemented (email + password)
- [ ] JWT tokens issued + verified
- [ ] Protected routes enforced (API middleware + frontend guards)
- [ ] Logout clears token
- [ ] Rate limiting on login attempts

**Tasks**:
- [ ] **Backend**:
  - [ ] Create User schema (Mongoose)
    - [ ] email (unique), passwordHash, plan_tier, created_at, updated_at
  - [ ] Implement auth routes (Express)
    - [ ] `POST /auth/signup` → Validate input, hash password (bcryptjs), create user, issue JWT
    - [ ] `POST /auth/login` → Validate email/password, issue JWT
    - [ ] `POST /auth/logout` → Clear token on frontend
    - [ ] `GET /auth/me` → Return current user (JWT protected)
  - [ ] Auth middleware
    - [ ] JWT verification + validation
    - [ ] Extract userId from token claims
    - [ ] Rate limiting (simple memory-based or Redis)
  - [ ] Password validation (min 8 chars, mix of cases)
  - [ ] Input sanitization (email normalization)

- [ ] **Frontend**:
  - [ ] Create login page (`/login`)
    - [ ] Email + password inputs
    - [ ] Form validation with Zod
    - [ ] Submit handler → API call
    - [ ] Error display
    - [ ] Link to signup
    - [ ] Store JWT in localStorage or httpOnly cookie
  - [ ] Create signup page (`/signup`)
    - [ ] Email + password + confirm inputs
    - [ ] Validation rules (password strength)
    - [ ] Submit handler → API call
    - [ ] Success → redirect to dashboard
  - [ ] Protected route wrapper
    - [ ] Redirect to `/login` if not authenticated
  - [ ] API client with auth
    - [ ] `auth.signup(email, password)`
    - [ ] `auth.login(email, password)`
    - [ ] `auth.logout()`
    - [ ] `auth.getCurrentUser()`

**Tests**:
- [ ] Unit:
  - [ ] Password hashing/validation
  - [ ] JWT token generation/validation
  - [ ] Form validation (Zod schemas)
- [ ] Integration:
  - [ ] Signup endpoint (duplicate email rejection)
  - [ ] Login endpoint (valid/invalid credentials)
  - [ ] Protected route returns 401 without auth
  - [ ] JWT token persists across requests
  - [ ] Rate limiting triggered
- [ ] E2E (Playwright):
  - [ ] Sign up flow end-to-end
  - [ ] Login flow end-to-end
  - [ ] Logout clears session
  - [ ] Protected page redirects unauthenticated user to login
  - [ ] After login, session persists on page reload

**Acceptance Criteria**:
- [ ] User can sign up with email/password
- [ ] User can log in with valid credentials
- [ ] Invalid credentials rejected (clear error message)
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Session persists after page reload (within token expiry)
- [ ] Multiple failed login attempts rate-limited

**Blockers/Dependencies**: Monorepo setup (Epic 1.1), MongoDB running
    - [ ] Submit handler → API call
  - [ ] Create protected route wrapper (HOC or middleware)
    - [ ] Redirect to `/login` if not authenticated
  - [ ] Create API client (`packages/sdk`)
    - [ ] `auth.login(email, password)`
    - [ ] `auth.signup(email, password)`
    - [ ] `auth.logout()`
    - [ ] `auth.getCurrentUser()`
  - [ ] Store session in localStorage or httpOnly cookie (backend sets)

**Tests**:
- [ ] Unit:
  - [ ] Password hashing/validation
  - [ ] JWT token generation/validation
  - [ ] Form validation (Zod schemas)
- [ ] Integration:
  - [ ] Login endpoint with valid/invalid credentials
  - [ ] Protected route returns 401 without auth
  - [ ] Session persists across requests
  - [ ] Rate limiting triggered
- [ ] E2E (Playwright):
  - [ ] Sign up flow end-to-end
  - [ ] Login flow end-to-end
  - [ ] Logout clears session + redirects to login
  - [ ] Protected page redirects unauthenticated user to login

**Acceptance Criteria**:
- [ ] User can sign up with email/password
- [ ] User can log in with valid credentials
- [ ] Invalid credentials rejected (clear error message)
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Session persists after page reload (within cookie/token expiry)
- [ ] Multiple failed login attempts rate-limited

**Blockers/Dependencies**: Monorepo setup (Epic 1.1)

---

### Story: User profile + plan tier placeholder

**Complexity**: Low | **Story Points**: 8

**DoD**:
- [ ] User profile page displays email + plan tier
- [ ] Profile edit form (email, password change)
- [ ] Plan tier label shown but not editable (placeholder for Phase 5)

**Tasks**:
- [ ] **Backend**:
  - [ ] Add `plan_tier` column to User table (enum: free, pro, pro_plus)
  - [ ] `GET /users/profile` → Return user profile
  - [ ] `PATCH /users/profile` → Update email/password (protected)
  - [ ] Validate input (email uniqueness, password strength)

- [ ] **Frontend**:
  - [ ] Create profile page (`/profile`)
    - [ ] Display user email + plan tier
    - [ ] Edit email form (with confirmation)
    - [ ] Change password form
    - [ ] Save button (API call)
    - [ ] Success/error messages
  - [ ] Add profile link to navbar (authenticated users only)

**Tests**:
- [ ] Unit: Input validation
- [ ] Integration: API endpoints with various user states
- [ ] E2E: Profile view + edit flow

**Acceptance Criteria**:
- [ ] User profile page loads with correct data
- [ ] Email can be changed (validation + uniqueness checked)
- [ ] Password can be changed (old password verification)
- [ ] Plan tier displays (non-editable UI)

**Blockers/Dependencies**: Auth implementation (previous story)

---

## EPIC 1.3 — Secure Uploads (Direct-to-Storage)

### Story: Signed upload URL endpoint + client upload flow

**Complexity**: High | **Story Points**: 21

**DoD**:
- [ ] Client uploads image to API (POST /uploads)
- [ ] Backend validates MIME type + size
- [ ] Image stored as Base64 in MongoDB scan document
- [ ] Upload progress tracking
- [ ] Simple, no-cost approach (no S3)

**Tasks**:
- [ ] **Backend**:
  - [ ] Create upload endpoint `POST /uploads`
    - [ ] Accept `multipart/form-data` with image file
    - [ ] Validate MIME type (whitelist: image/jpeg, image/png)
    - [ ] Validate size (<10MB for MVP)
    - [ ] Compress image with Sharp
    - [ ] Convert to Base64
    - [ ] Create ScanUpload document in MongoDB
    - [ ] Return upload ID + image metadata
  - [ ] `GET /uploads/:uploadId` → Retrieve image Base64
  - [ ] Error handling for invalid files

- [ ] **Frontend**:
  - [ ] Create upload page (`/upload`)
    - [ ] File input + drag-drop zone
    - [ ] File validation on client (type, size)
    - [ ] Preview selected image
    - [ ] Upload button
  - [ ] Upload flow:
    - [ ] Select file
    - [ ] Show preview
    - [ ] POST file to `/uploads` endpoint (multipart)
    - [ ] Track upload progress (XMLHttpRequest or fetch)
    - [ ] On success: create scan + redirect to scan page
  - [ ] Error handling (validation, network, etc.)

**Tests**:
- [ ] Unit: MIME type validation, size validation
- [ ] Security:
  - [ ] MIME spoof test (e.g., .exe with image MIME header)
  - [ ] Oversized file rejection (>10MB)
  - [ ] XSS protection in filename
- [ ] Integration:
  - [ ] Upload endpoint stores Base64 in MongoDB
  - [ ] Metadata persisted correctly
- [ ] E2E (Playwright):
  - [ ] Upload valid image (progress visible)
  - [ ] Upload invalid MIME type (rejected)
  - [ ] Upload oversized file (rejected)
  - [ ] Successful upload redirects to scan page

**Acceptance Criteria**:
- [ ] User can upload image (JPEG/PNG, <10MB)
- [ ] Upload progress visible
- [ ] Invalid uploads rejected with clear errors
- [ ] Image stored as Base64 in MongoDB

**Blockers/Dependencies**: Auth (Epic 1.2)

---

### Story: Server-side image sanitization (decode/re-encode)

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Sanitized image derivative stored (JPEG/PNG re-encoded)
- [ ] Metadata stripped (EXIF, color profile, etc.)
- [ ] Triggers automatically after upload completion
- [ ] Original and sanitized versions both accessible

**Tasks**:
- [ ] **Backend** (Node.js + Bull worker):
  - [ ] Install image processing library (sharp or ImageMagick)
  - [ ] Create worker job `sanitizeImage.job.ts`
    - [ ] Fetch original image from S3
    - [ ] Decode image (validate it's actually an image)
    - [ ] Strip EXIF + metadata
    - [ ] Re-encode as JPEG (standard quality)
    - [ ] Store sanitized version to S3 with `_sanitized` suffix
    - [ ] Update DB record with sanitized_s3_key
    - [ ] Log any errors
  - [ ] Trigger job automatically when upload status changes to 'completed'
  - [ ] Monitor job queue for failures

**Tests**:
- [ ] Unit: Image re-encoding (compare dimensions, format)
- [ ] Security:
  - [ ] Malicious files rejected at decode step (e.g., invalid JPEG)
  - [ ] EXIF data removed (verify with metadata reader)
  - [ ] PNG color profile stripped
- [ ] Regression:
  - [ ] Sample images processed consistently
  - [ ] Output quality acceptable (visual spot-check)

**Acceptance Criteria**:
- [ ] Uploaded images automatically sanitized
- [ ] Sanitized version differs from original (metadata removed)
- [ ] Invalid images cause job error (not crash)

**Blockers/Dependencies**: Upload endpoint (previous story)

---

## EPIC 1.4 — Scan Orchestration + Status

### Story: Create scan job + status polling endpoint

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Scan record created with UUID + initial status='pending'
- [ ] Status transitions visible (pending → processing → completed/failed)
- [ ] Polling endpoint returns current status + progress

**Tasks**:
- [ ] **Backend**:
  - [ ] Create Scan table
    - [ ] id (UUID PK), user_id (FK), upload_id (FK), status (enum), created_at, updated_at, results (JSON)
  - [ ] `POST /scans` → Create scan from upload_id (protected)
    - [ ] Validate upload exists + belongs to user
    - [ ] Create Scan record with status='pending'
    - [ ] Queue OCR job
    - [ ] Return scan_id
  - [ ] `GET /scans/:scanId` → Get scan details + status (protected)
    - [ ] Validate user owns scan
    - [ ] Return { id, status, created_at, results: null }
  - [ ] `GET /scans` → List user's scans (protected)
    - [ ] Pagination (limit, offset)
    - [ ] Filter by status (optional)

- [ ] **Frontend**:
  - [ ] After upload success, create scan: `POST /scans` with uploadId
  - [ ] Navigate to `/scans/:scanId` (status page)
  - [ ] Status page polls `GET /scans/:scanId` every 2 seconds
  - [ ] Display status + spinner
    - [ ] "Extracting text..." (OCR phase)
    - [ ] "Analyzing..." (match phase)
    - [ ] "Done!" (completed)
  - [ ] On completion, show results or redirect

**Tests**:
- [ ] Unit: Status transition logic
- [ ] Integration:
  - [ ] Scan creation persists to DB
  - [ ] Status polling returns correct state
- [ ] E2E: Status page updates as scan progresses

**Acceptance Criteria**:
- [ ] Scan created after upload
- [ ] Status changes over time (visible in polling)
- [ ] Completed scans show results

**Blockers/Dependencies**: Upload (Epic 1.3), OCR job queuing (Epic 1.5)

---

## EPIC 1.5 — OCR Extraction v1

### Story: OCR service + ROI extraction + parsing

**Complexity**: High | **Story Points**: 21

**DoD**:
- [ ] OCR extracts card text fields (set, number, name, etc.)
- [ ] Structured output with confidence scores + bounding boxes
- [ ] Parsing handles common variations (extra spaces, case mismatches)
- [ ] Fallback for unreadable cards (graceful degradation)

**Tasks**:
- [ ] **Backend** (Node.js + Bull worker OR Python):
  - [ ] If Node.js: Use Tesseract.js or cloud OCR (Google Vision, AWS Textract)
  - [ ] If Python: Tesseract or EasyOCR
  - [ ] Create OCR job `ocrExtract.job.ts`
    - [ ] Fetch sanitized image from S3
    - [ ] Extract full text + bounding boxes
    - [ ] Parse text into structured fields
      - [ ] Card Name
      - [ ] Set (e.g., "Base Set", "Jungle")
      - [ ] Card Number (e.g., "25/102")
      - [ ] HP (if present)
      - [ ] Type (Pokémon type: Water, Fire, etc.)
    - [ ] Return OCR result with field-level confidence
    - [ ] Store result in DB (Scan.results.ocr)
    - [ ] Update Scan status to 'ocr_complete' or next phase
  - [ ] Parsing logic:
    - [ ] Normalize text (trim, lowercase for comparison)
    - [ ] Use regex for set/number extraction
    - [ ] Rank by confidence; pick top match or mark ambiguous
  - [ ] Error handling: If OCR fails, mark scan as 'ocr_failed'

- [ ] **Frontend** (display + edit):
  - [ ] On scan complete, show OCR results page
    - [ ] Display extracted fields (name, set, number, etc.)
    - [ ] Show confidence scores (>90%, 70-90%, <70%)
    - [ ] Display bounding boxes overlay on image (optional)

**Tests**:
- [ ] Unit: Text parsing (regex, normalization)
- [ ] AI Validation:
  - [ ] Run OCR on 50-item test set (golden images)
  - [ ] Compare extracted fields to ground truth
  - [ ] Target: >90% character accuracy
  - [ ] Report: Field-level accuracy (name, set, number separately)
- [ ] Integration: OCR job → DB persistence
- [ ] E2E: OCR results display in UI

**Acceptance Criteria**:
- [ ] OCR extracts key fields correctly >90% of time on clean images
- [ ] Parsing handles set/number format variations
- [ ] Confidence scores provided

**Blockers/Dependencies**: Scan orchestration (Epic 1.4)

---

### Story: OCR correction UI + rerun match

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] User can edit OCR fields inline
- [ ] Clicking "Rerun" triggers fresh match with corrected fields
- [ ] Results update without page reload

**Tasks**:
- [ ] **Backend**:
  - [ ] `PATCH /scans/:scanId/ocr` → Update OCR results (protected)
    - [ ] Accept { name, set, number, type, ... }
    - [ ] Validate format (e.g., number is "25/102")
    - [ ] Store corrected fields in DB
    - [ ] Queue matching job with corrected data
    - [ ] Return updated scan record
  - [ ] Rerun matching job (triggered by PATCH)

- [ ] **Frontend**:
  - [ ] Editable OCR results form
    - [ ] Each field has text input
    - [ ] Original + corrected value displayed
    - [ ] Save button → `PATCH /scans/:scanId/ocr`
  - [ ] After save, re-fetch matching results
  - [ ] Show success toast

**Tests**:
- [ ] Unit: OCR field validation
- [ ] Integration: Update endpoint + matching rerun
- [ ] E2E: Edit fields, save, see new match results

**Acceptance Criteria**:
- [ ] User can edit all OCR fields
- [ ] Corrections trigger new match
- [ ] Match results update without reload

**Blockers/Dependencies**: OCR extraction (previous story), Reference matching (Epic 1.6)

---

## EPIC 1.6 — Reference Matching v1

### Story: ReferenceCard ingestion (minimal dataset)

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Reference card dataset ingested (500-1000 sample cards)
- [ ] Lookups by set+number work efficiently
- [ ] Reference images stored in S3 (pointers in DB)

**Tasks**:
- [ ] **Data**:
  - [ ] Gather reference data (CSV or JSON)
    - [ ] Columns: set, number, name, hp, type, image_url, rarity, etc.
  - [ ] Validate data (deduplicate, fix format)
  - [ ] Store reference images in S3
  - [ ] Create seed script (load into DB)

- [ ] **Backend**:
  - [ ] Create ReferenceCard table
    - [ ] id, set, number, name, hp, type, image_s3_key, metadata (JSON), created_at
  - [ ] Create DB index on (set, number) for fast lookup
  - [ ] `POST /admin/reference-cards/seed` → Load reference data (admin only)
    - [ ] Accept CSV/JSON file
    - [ ] Upsert records (handle duplicates)
    - [ ] Return count of loaded/updated records
  - [ ] `GET /reference-cards/lookup?set=Base%20Set&number=25` → Lookup card
    - [ ] Return matching reference card + image URL

**Tests**:
- [ ] Unit: Data validation + parsing
- [ ] Integration: Ingestion + lookup
- [ ] Data Quality:
  - [ ] No duplicate (set, number) pairs
  - [ ] All images accessible in S3
  - [ ] Query performance: <50ms for lookup

**Acceptance Criteria**:
- [ ] Reference cards ingested without errors
- [ ] Lookup by set+number returns correct card <50ms

**Blockers/Dependencies**: None (parallel with other stories)

---

### Story: Matching logic + alternatives

**Complexity**: High | **Story Points**: 21

**DoD**:
- [ ] Scanned card matched to reference database
- [ ] Match confidence score computed
- [ ] Top-N alternative matches returned (for ambiguous cases)

**Tasks**:
- [ ] **Backend**:
  - [ ] Create matching service `matchService.ts`
    - [ ] Input: OCR result (name, set, number)
    - [ ] Exact match: Look up by (set, number)
    - [ ] Fuzzy match: If no exact match, search by name + set
      - [ ] Use string similarity (Levenshtein or cosine similarity)
      - [ ] Threshold: >0.85 confidence for auto-match
    - [ ] Return: Top match + top-5 alternatives with scores
  - [ ] Store match result in Scan.results.match
  - [ ] Job: `matchScan.job.ts` (Bull worker)
    - [ ] Accept scanId + OCR result
    - [ ] Call matching service
    - [ ] Update Scan with match results
    - [ ] Update status to 'matched'

- [ ] **Frontend**:
  - [ ] Results page shows matched card
    - [ ] Display reference image + metadata
    - [ ] Show match confidence (%)
    - [ ] Show alternatives (if confidence <95%)
    - [ ] User can click alternative to override match

**Tests**:
- [ ] Unit: String similarity scoring
- [ ] AI Validation:
  - [ ] Run on 100-card test set
  - [ ] Measure: precision, recall, F1 score
  - [ ] Target: >85% match accuracy on clean OCR
  - [ ] Report top failure modes
- [ ] Integration: OCR → Match pipeline
- [ ] E2E: Full pipeline (upload → OCR → match)

**Acceptance Criteria**:
- [ ] Scanned cards matched to reference DB >85% accuracy
- [ ] Match confidence scores provided
- [ ] Alternatives shown for ambiguous matches

**Blockers/Dependencies**: Reference data (previous story), OCR (Epic 1.5)

---

## EPIC 1.7 — MVP UI (Dashboard + Results)

### Story: Dashboard (scan history)

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Dashboard lists all user scans (date, card name, status)
- [ ] Pagination works (20 scans per page)
- [ ] Filter by status (pending, completed, failed)
- [ ] Click scan row → navigate to result

**Tasks**:
- [ ] **Frontend**:
  - [ ] Create dashboard page (`/dashboard`)
    - [ ] Fetch scans: `GET /scans?limit=20&offset=0`
    - [ ] Display table:
      - [ ] Date scanned
      - [ ] Card name
      - [ ] Set
      - [ ] Status badge (Pending, Completed, Failed)
      - [ ] Action: View result (link to `/results/:scanId`)
    - [ ] Pagination controls (Prev/Next)
    - [ ] Status filter dropdown
    - [ ] Refresh button
    - [ ] Empty state: "No scans yet"

**Tests**:
- [ ] Unit: N/A (UI component)
- [ ] Integration: Scan list API
- [ ] E2E: Dashboard loads, pagination works, filter works
- [ ] Performance: Dashboard loads with 1000 scans, <2s initial load

**Acceptance Criteria**:
- [ ] Dashboard displays user scans in date order
- [ ] Pagination navigates scans
- [ ] Status filter works

**Blockers/Dependencies**: Scan orchestration (Epic 1.4)

---

### Story: Result page v1 (ID + OCR + match)

**Complexity**: Medium | **Story Points**: 13

**DoD**:
- [ ] Result page displays matched card + OCR fields + image
- [ ] Shows match confidence + warnings
- [ ] User can edit OCR + rerun (link to edit form)
- [ ] Clean, mobile-friendly layout

**Tasks**:
- [ ] **Frontend**:
  - [ ] Create result page (`/results/:scanId`)
    - [ ] Fetch scan: `GET /scans/:scanId`
    - [ ] Layout:
      - **Left**: Uploaded image (user's card photo)
      - **Middle**: OCR extracted fields (name, set, number, etc.)
      - **Right**: Matched reference card + metadata
    - [ ] Match confidence badge (e.g., "95% Confident")
    - [ ] Warnings (if any):
      - [ ] "Low OCR confidence on set name"
      - [ ] "Multiple matches found"
    - [ ] Edit OCR button → Modal or separate page
    - [ ] Share button (copy link) → Phase 5
    - [ ] Add to collection button → Phase 5

**Tests**:
- [ ] Integration: Scan fetch API
- [ ] E2E: Result page displays correctly
  - [ ] Images load
  - [ ] All fields present
  - [ ] Edit button navigates to edit form
- [ ] Accessibility: Alt text on images, labels on fields
- [ ] Visual: Screenshot regression baseline

**Acceptance Criteria**:
- [ ] Result page displays all key data
- [ ] Responsive on mobile (stack vertically)
- [ ] Edit OCR workflow accessible

**Blockers/Dependencies**: Matching (Epic 1.6)

---

## Phase 1 — Summary Checklist

### Must-Have Deliverables
- [ ] Monorepo setup + CI/CD
- [ ] Auth (signup/login/logout)
- [ ] Secure upload (S3 direct upload)
- [ ] Image sanitization worker
- [ ] Scan creation + status tracking
- [ ] OCR extraction (Tesseract or cloud)
- [ ] Reference card database + matching
- [ ] Dashboard (scan history)
- [ ] Result page (ID + OCR + match)
- [ ] End-to-end tests (E2E + integration)

### Testing Targets
- [ ] Unit test coverage: >70% (critical paths)
- [ ] E2E coverage: Login, upload, scan, view result
- [ ] Security tests: MIME validation, IDOR, rate limiting
- [ ] AI validation: OCR accuracy >90%, Match accuracy >85%
- [ ] Performance: P95 scan time <30s

### Success Criteria (DoD)
- ✅ MVP user can upload card image, get ID + OCR + basic match
- ✅ Scan completion rate >95% (on valid inputs)
- ✅ OCR accuracy >90% on clean images
- ✅ Match accuracy >85% on reference set
- ✅ Zero IDOR vulnerabilities (security review passed)
- ✅ CI/CD pipeline green on main branch
- ✅ No external dependency on manual OCR (all automated)

---

## Dependencies & Risk Management

| Dependency | Owned By | Status |
|------------|----------|--------|
| Auth provider setup | DevOps | TBD |
| AWS S3 bucket creation | DevOps | TBD |
| PostgreSQL 15 license | DevOps | Free |
| OCR library (Tesseract or vendor) | AI/ML | TBD |
| Reference card dataset | Product | TBD |

| Risk | Severity | Mitigation |
|------|----------|-----------|
| OCR accuracy insufficient | High | Use commercial OCR (Google Vision) if Tesseract <85% |
| Upload file size DoS | Medium | Strict limit (50MB) + rate limiting |
| Scan pipeline bottleneck | Medium | Queue workers scaled independently |
| Data ingestion errors | Low | Validation + seed script tests before prod |

---

## Timeline Template

| Week | Goals | Milestone |
|------|-------|-----------|
| 1-2 | Epic 1.1 (monorepo) | Scaffold + CI ready |
| 2-3 | Epic 1.2 (auth) + 1.3 (upload) | Login + upload working |
| 4-5 | Epic 1.4 (orchestration) + 1.5 (OCR) | Scans created + OCR running |
| 6 | Epic 1.6 (matching) | Reference DB + matching complete |
| 7-8 | Epic 1.7 (UI) + Testing | Dashboard + result page + E2E tests |
| 9-12 | Buffer + hardening | Security review, perf optimization, edge case handling |

---

**Next Step**: After Phase 0 design/threat model approval, kickoff Phase 1 Epic 1.1 (monorepo setup).
