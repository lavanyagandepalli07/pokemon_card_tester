# Pokemon Card Authentication Platform — Product Roadmap

**Current Date**: May 27, 2026  
**Status**: Planning Phase (Phase 0)

## Table of Contents
- [PHASE 0 — Product Definition + Risk Burn-Down](#phase-0)
- [PHASE 1 — Foundation MVP](#phase-1)
- [PHASE 2 — Pro Image Pipeline + Quality Gates](#phase-2)
- [PHASE 3 — Authenticity Engine v1](#phase-3)
- [PHASE 4 — Rarity + Market Valuation Engine](#phase-4)
- [PHASE 5 — Collections, Wishlist, Analytics](#phase-5)
- [PHASE 6 — Mobile + Live Camera Scanning](#phase-6)
- [PHASE 7 — Advanced AI (Condition + Centering + Grading)](#phase-7)
- [PHASE 8 — Scale & Production Hardening](#phase-8)

---

## PHASE 0 — Product Definition + Risk Burn-Down

**Goal**: Define MVP scope, validate AI feasibility, address legal/security/privacy upfront.

### EPIC 0.1 — PRD, UX, and Success Metrics

#### STORY: Define MVP scope + success metrics + non-goals
- **DoD**: 
  - PRD approved
  - Metrics defined: activation rate, scan completion rate, match accuracy tiers
- **Tests**: 
  - Acceptance review checklist
  - Usability test notes archived

#### STORY: Create end-to-end user journeys (collector, buyer, shop)
- **DoD**: 
  - Journey maps + edge cases documented
- **Tests**: 
  - Stakeholder walkthrough sign-off

---

### EPIC 0.2 — Legal/IP + Data Source Strategy

#### STORY: Document licensing approach for reference images/metadata
- **DoD**: 
  - Allowed sources list + constraints
  - Disclaimers drafted
- **Tests**: 
  - Legal review checklist completed

#### STORY: Define pricing data sourcing (APIs/partners)
- **DoD**: 
  - Providers chosen
  - Terms compliance plan
- **Tests**: 
  - Rate-limit + outage handling plan reviewed

---

### EPIC 0.3 — Threat Model + Privacy Plan

#### STORY: Threat model (uploads, auth, IDOR, abuse, model theft)
- **DoD**: 
  - Threat model documented
  - Mitigations identified + owners assigned
- **Tests**: 
  - Security review gate passed

#### STORY: Privacy + retention policy (artifacts, user data, opt-in training)
- **DoD**: 
  - Data retention tiers by plan defined
  - Delete/export workflows defined
- **Tests**: 
  - DPIA-style checklist completed

---

### EPIC 0.4 — AI Feasibility Baselines

#### STORY: Build evaluation harness spec (OCR, match, authenticity)
- **DoD**: 
  - Metrics + dataset splits + reporting format defined
- **Tests**: 
  - Dry-run with tiny dataset produces report

---

### PHASE 0 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | N/A (design artifacts) |
| **Integration** | N/A |
| **E2E** | Prototype usability sessions |
| **Security** | Threat model review |
| **AI Validation** | Baseline eval plan + metric thresholds drafted |
| **Performance** | Budget targets defined (P95 scan time, upload limits) |
| **Acceptance** | PRD + UX prototype approved |
| **Regression** | Golden dataset definition started |

---

## PHASE 1 — Foundation MVP (Upload → OCR → Identify → Basic Report)

**Goal**: Establish core tech stack, auth, secure uploads, and end-to-end scan pipeline.

### EPIC 1.1 — Monorepo + Core Tooling

#### STORY: Create monorepo skeleton (web, services, packages, infra)
- **DoD**: 
  - Repo builds locally
  - Shared types package exists
- **Tests**: 
  - CI lint/typecheck passes on PR

---

### EPIC 1.2 — Authentication + User System

#### STORY: Implement auth (email/OAuth) + sessions
- **DoD**: 
  - Login/logout works
  - Protected routes enforced
- **Tests**: 
  - Unit auth helpers
  - Integration auth-protected API
  - E2E login flow

#### STORY: User profile + plan tier placeholder
- **DoD**: 
  - User profile page exists
  - Plan tier stored
- **Tests**: 
  - Unit validation
  - E2E profile edit

---

### EPIC 1.3 — Secure Uploads (Direct-to-Storage)

#### STORY: Signed upload URL endpoint + client upload flow
- **DoD**: 
  - Front/back upload works
  - Progress UI present
  - Metadata stored
- **Tests**: 
  - Integration signed URL policy
  - Security MIME spoof tests
  - E2E upload

#### STORY: Server-side image sanitization (decode/re-encode)
- **DoD**: 
  - Sanitized derivative stored
  - Metadata stripped
- **Tests**: 
  - Security malicious file tests
  - Regression sample set

---

### EPIC 1.4 — Scan Orchestration + Status

#### STORY: Create scan job + status polling endpoint
- **DoD**: 
  - Scan created
  - Status transitions visible
- **Tests**: 
  - Integration DB state
  - E2E scan progress

---

### EPIC 1.5 — OCR Extraction v1

#### STORY: OCR service + ROI extraction + parsing
- **DoD**: 
  - Returns structured fields + confidences + boxes
- **Tests**: 
  - AI validation OCR accuracy report
  - Unit parsing
  - Integration pipeline

#### STORY: OCR correction UI + rerun match
- **DoD**: 
  - User edits fields
  - Triggers rerun
  - Results update
- **Tests**: 
  - E2E correction workflow
  - Regression

---

### EPIC 1.6 — Reference Matching v1

#### STORY: ReferenceCard ingestion (minimal dataset)
- **DoD**: 
  - Can lookup by set+number
  - Stores reference images pointers
- **Tests**: 
  - Integration ingestion
  - Data quality checks

#### STORY: Matching logic + alternatives
- **DoD**: 
  - Match confidence computed
  - Top-N candidates returned
- **Tests**: 
  - AI validation match accuracy
  - Unit scoring rules

---

### EPIC 1.7 — MVP UI (Dashboard + Results)

#### STORY: Dashboard (scan history)
- **DoD**: 
  - Lists scans
  - Filters + pagination work
- **Tests**: 
  - E2E dashboard
  - Perf basic

#### STORY: Result page v1 (ID + OCR + match)
- **DoD**: 
  - Clean UX displayed
  - Shows confidence + warnings
- **Tests**: 
  - E2E result rendering
  - Accessibility checks

---

### PHASE 1 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | validators, parsers, scoring, auth helpers |
| **Integration** | upload→scan→OCR→match→persist |
| **E2E** | login, upload front/back, view results, edit OCR, rerun |
| **Security** | MIME spoofing, oversize, rate-limits, IDOR checks |
| **AI Validation** | OCR + match metrics on curated dataset |
| **Performance** | P95 scan completion time baseline |
| **Acceptance** | >90% ID accuracy on clean images in test set; stable UX |
| **Regression** | Golden scans (50–200) tracked |

---

## PHASE 2 — Pro Image Pipeline + Quality Gates

**Goal**: Improve image preprocessing and quality assessment.

### EPIC 2.1 — Card Boundary Detection + Perspective Correction

#### STORY: Implement robust crop/warp + rotation normalization
- **DoD**: 
  - Normalized derivative produced consistently
- **Tests**: 
  - CV IoU/crop correctness
  - Edge-case suite

---

### EPIC 2.2 — Quality Signals + Recapture Guidance

#### STORY: Blur/glare/partial detection + user guidance copy
- **DoD**: 
  - Quality warnings shown
  - Scan gates when unusable
- **Tests**: 
  - E2E failure states
  - AI/CV validation on hard images

---

### EPIC 2.3 — Pipeline Versioning + Artifact Storage

#### STORY: Store pipeline version + derivatives + transforms
- **DoD**: 
  - Reproducible runs
  - Artifacts linked to scan
- **Tests**: 
  - Regression re-run produces same outputs within tolerance

---

### PHASE 2 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | quality thresholds, transform utilities |
| **Integration** | preprocess→OCR improves metrics |
| **E2E** | recapture prompts, blocked scans, retry |
| **Security** | artifact access control |
| **AI Validation** | crop correctness, OCR uplift |
| **Performance** | preprocess time budget |
| **Acceptance** | >95% correct crop/warp or clear recapture prompt |
| **Regression** | golden hard-capture set |

---

## PHASE 3 — Authenticity Engine v1 (Explainable Counterfeit Detection)

**Goal**: Implement ML-based authenticity detection with explainability.

### EPIC 3.1 — Reference Alignment + Compare View

#### STORY: Align upload to reference + generate diff artifacts
- **DoD**: 
  - Alignment transform stored
  - Diff usable in UI
- **Tests**: 
  - Regression alignment
  - E2E compare viewer

---

### EPIC 3.2 — Forensic Heuristics (Borders/Text/Symbols/Color)

#### STORY: Implement border thickness + aspect + corner checks
- **DoD**: 
  - Signals computed with confidence
- **Tests**: 
  - Unit + CV validation suite

#### STORY: Text alignment + font consistency checks
- **DoD**: 
  - Flags misalignment
  - Links to evidence regions
- **Tests**: 
  - AI validation on known fakes

#### STORY: Color profile + print artifact checks (capture-aware)
- **DoD**: 
  - Avoids false certainty under bad lighting
- **Tests**: 
  - Robustness tests (compression, low-light)

---

### EPIC 3.3 — Learned Similarity + OOD Detection

#### STORY: Embedding model inference + similarity scoring
- **DoD**: 
  - Similarity + uncertainty produced
  - Versioned model
- **Tests**: 
  - AI metrics
  - Calibration tests

#### STORY: Confidence calibration pipeline
- **DoD**: 
  - Calibrated confidence reported
- **Tests**: 
  - Calibration curves in CI report

---

### EPIC 3.4 — Heatmaps + Explanation Report

#### STORY: Generate heatmaps (Grad-CAM/patch diff)
- **DoD**: 
  - Heatmaps stored + rendered
- **Tests**: 
  - Regression snapshots
  - E2E overlays

#### STORY: Explanation builder (template-first, safe)
- **DoD**: 
  - Explanation cites indicators + uncertainty
- **Tests**: 
  - Prompt injection safety tests (if LLM used)
  - Snapshot tests

---

### EPIC 3.5 — Authenticity UI (Premium Report)

#### STORY: Authenticity meter + fake probability + confidence
- **DoD**: 
  - Clear UX displayed
  - Tooltips + capture warnings present
- **Tests**: 
  - E2E
  - Accessibility
  - Visual regression

#### STORY: Zoom/inspect + side-by-side + heatmap toggles
- **DoD**: 
  - Smooth performance
  - Mobile-friendly
- **Tests**: 
  - Perf tests
  - E2E interactions

---

### PHASE 3 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | scoring fusion, indicator ranking |
| **Integration** | match→authenticity pipeline with artifacts |
| **E2E** | full report rendering + overlays + compare viewer |
| **Security** | quotas, abuse simulation, artifact authz, audit logs |
| **AI Validation** | precision/recall/F1, FP/FN review, calibration |
| **Performance** | GPU/CPU latency budgets; queue lag monitoring |
| **Acceptance** | published metric targets hit on curated sets by tier |
| **Regression** | golden counterfeit suite + tolerance thresholds |

---

## PHASE 4 — Rarity + Market Valuation Engine

**Goal**: Provide rarity classification and market valuation data.

### EPIC 4.1 — Rarity Classification + Metadata Completeness

#### STORY: Rarity from reference metadata + UI badge
- **DoD**: 
  - Badge reliable
  - Fallbacks defined
- **Tests**: 
  - Unit mapping
  - E2E display

---

### EPIC 4.2 — Pricing Aggregation + Caching

#### STORY: Price ingestion from approved sources
- **DoD**: 
  - Price snapshots stored with provenance
- **Tests**: 
  - Integration
  - Outage simulation

#### STORY: Valuation output (range + confidence)
- **DoD**: 
  - Shows last updated + sources + range
- **Tests**: 
  - Regression
  - Acceptance checks

---

### EPIC 4.3 — Portfolio Value

#### STORY: Portfolio rollups across collections
- **DoD**: 
  - Accurate totals
  - Currency handling correct
- **Tests**: 
  - Unit calculations
  - E2E portfolio view

---

### PHASE 4 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | pricing calculations, currency conversions |
| **Integration** | ingestion→cache→API→UI |
| **E2E** | view price, trends, portfolio totals |
| **Security** | provider key security, abuse throttles |
| **AI Validation** | (if rarity classifier added) accuracy tests |
| **Performance** | caching effectiveness |
| **Acceptance** | stable price display + provenance; correct portfolio totals |
| **Regression** | price snapshots sanity checks |

---

## PHASE 5 — Collections, Wishlist, Scan History, Analytics

**Goal**: Enable collectors to organize and analyze their portfolios.

### EPIC 5.1 — Collections CRUD + Items

#### STORY: Create/edit/delete collections + add scanned card
- **DoD**: 
  - CRUD complete
  - Permissions correct
- **Tests**: 
  - E2E
  - IDOR tests

---

### EPIC 5.2 — Wishlist + Alerts (optional)

#### STORY: Wishlist items + price alerts
- **DoD**: 
  - Alerts queued
  - User settings stored
- **Tests**: 
  - Integration alert pipeline
  - E2E settings

---

### EPIC 5.3 — Analytics + Exports

#### STORY: Portfolio analytics dashboards
- **DoD**: 
  - Charts + filters present
  - Export CSV/PDF works
- **Tests**: 
  - E2E exports
  - Perf tests

---

### PHASE 5 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | authorization policies, calculations |
| **Integration** | collections→portfolio→pricing linkage |
| **E2E** | manage collections, exports |
| **Security** | authz/IDOR, share token security |
| **Performance** | large collection pagination |
| **Acceptance** | collectors can manage portfolio end-to-end |
| **Regression** | collection operations stable |

---

## PHASE 6 — Mobile + Live Camera Scanning

**Goal**: Deliver seamless mobile capture and real-time feedback.

### EPIC 6.1 — Camera Capture UX (Web)

#### STORY: getUserMedia capture with overlay guides
- **DoD**: 
  - Works on major mobile browsers
  - Permission flows solid
- **Tests**: 
  - Device matrix E2E
  - Manual QA checklist

#### STORY: Real-time quality feedback (glare/blur/stability)
- **DoD**: 
  - Feedback reduces bad captures
- **Tests**: 
  - A/B capture quality metrics
  - Regression suite

---

### EPIC 6.2 — Realtime Scan Status

#### STORY: SSE/WebSocket scan progress updates
- **DoD**: 
  - No polling needed
  - Reconnect works
- **Tests**: 
  - Integration
  - Network drop tests

---

### PHASE 6 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | camera state machine |
| **Integration** | camera→upload→scan pipeline |
| **E2E** | mobile scan full flow |
| **Security** | camera permission abuse not applicable; focus on auth/session |
| **Performance** | mobile render perf + bandwidth caps |
| **Acceptance** | scan experience feels premium and reliable |
| **Regression** | device/browser matrix baseline |

---

## PHASE 7 — Advanced AI (Condition + Centering + Damage + Grading Approx.)

**Goal**: Deliver detailed condition assessment and grading estimates.

### EPIC 7.1 — Condition Sub-Models

#### STORY: Centering analysis
- **DoD**: 
  - Centering score with evidence overlay
- **Tests**: 
  - CV validation
  - Regression

#### STORY: Edgewear/whitening detection
- **DoD**: 
  - Localization + sub-score
- **Tests**: 
  - Labeled dataset metrics

#### STORY: Surface scratches/dents (quality-gated)
- **DoD**: 
  - Only runs when capture supports
  - Avoids false certainty
- **Tests**: 
  - Hard-case suite + confidence gating tests

---

### EPIC 7.2 — Grade Estimate + Disclaimers

#### STORY: Grade range + confidence + explanation
- **DoD**: 
  - Clear disclaimers present
  - Transparent uncertainty
- **Tests**: 
  - Snapshot tests
  - Acceptance rubric

---

### PHASE 7 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | scoring aggregation |
| **Integration** | condition→report pipeline |
| **E2E** | condition report view + overlays |
| **Security** | abuse throttling (GPU) |
| **AI Validation** | inter-rater reliability, bias checks, drift monitoring |
| **Performance** | GPU budgets |
| **Acceptance** | grade ranges stable and quality-gated |
| **Regression** | golden condition set |

---

## PHASE 8 — Scale & Production Hardening

**Goal**: Prepare for public launch and sustained operations.

### EPIC 8.1 — Distributed Inference + GPU Ops

#### STORY: GPU worker autoscaling + batching
- **DoD**: 
  - Handles load spikes
  - Predictable costs
- **Tests**: 
  - Load tests
  - Chaos tests

#### STORY: Model registry + canary deploy + rollback
- **DoD**: 
  - Promote/rollback in minutes
- **Tests**: 
  - Staged canary tests
  - Regression suite

---

### EPIC 8.2 — Observability + Incident Response

#### STORY: Metrics, tracing, alerting (queue lag, inference latency, errors)
- **DoD**: 
  - Dashboards + alerts operational
- **Tests**: 
  - Alert fire drills

#### STORY: Incident runbooks + postmortem template
- **DoD**: 
  - Runbooks published and rehearsed
- **Tests**: 
  - Tabletop exercise

---

### EPIC 8.3 — Security Hardening

#### STORY: WAF rules + bot protection + advanced rate limiting
- **DoD**: 
  - Abuse reduced
  - False positives controlled
- **Tests**: 
  - Attack simulations
  - Fuzzing

#### STORY: Backup/restore + DR drills
- **DoD**: 
  - Restore verified
  - RPO/RTO met
- **Tests**: 
  - Restore test passes monthly

---

### PHASE 8 — Testing & Validation
| Category | Scope |
|----------|-------|
| **Unit** | infra scripts validations |
| **Integration** | full system staging tests |
| **E2E** | release candidate suite |
| **Security** | pentest + dependency scans + SAST/DAST |
| **AI Validation** | drift monitoring + scheduled regressions |
| **Performance** | sustained load + soak tests |
| **Acceptance** | SLOs met; rollback proven; DR proven |
| **Regression** | always-on golden suite in CI |

---

## Success Metrics & KPIs

### Phase 0 Metrics
- [ ] PRD approval rate: 100%
- [ ] Activation metric targets defined
- [ ] Scan completion baseline established
- [ ] Match accuracy tiers documented

### Phase 1 Metrics
- [ ] OCR accuracy: >90% on clean images
- [ ] Match accuracy: >85% on reference set
- [ ] Scan completion rate: >95%
- [ ] P95 scan time: <30s

### Phase 3 Metrics
- [ ] Authenticity precision: >95%
- [ ] False positive rate: <2%
- [ ] Explanation clarity: user satisfaction >4/5

### Phase 8 Metrics
- [ ] Uptime: 99.95%
- [ ] P99 latency: <5s
- [ ] Cost per scan: <$0.50 (target)

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| OCR accuracy insufficient for MVP | **High** | Dry-run with dataset in Phase 0; consider commercial OCR fallback |
| Counterfeit detection false positives | **High** | Calibration pipeline + user feedback loop early; conservative thresholds |
| Data source availability (pricing/reference) | **Medium** | Multi-source strategy; caching + stale-data fallbacks |
| GPU cost scaling | **Medium** | Batching, model quantization, cost monitoring from day 1 |
| Privacy regulation changes | **Medium** | GDPR/privacy compliance built in Phase 0; quarterly reviews |

---

## Document History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-05-27 | Product | Initial roadmap (8 phases) |
