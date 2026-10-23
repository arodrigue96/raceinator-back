# Tasks: Default teams reset + input hardening

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: Setup
- [ ] T001 [back] Add `zod`, `express-rate-limit`, `helmet` (latest, `npm audit` 0)
- [ ] T002 [back] `data/teams2026.json` imageUrls as relative `/images/teams/*.webp` paths

## Phase 2: US2 — Injection-proof writes (P1)
- [ ] T010 [back] Failing tests: abuse payloads (operators, unknown keys, bad imageUrl, bad id, 10 kB+, cap 50) → 4xx
- [ ] T011 [back] Zod schemas + `validate` middleware on POST /teams, GET/DELETE /teams/:id
- [ ] T012 [back] `express.json({limit:"10kb"})`, 413/400 mapping in `handleGeneralErrors`, `helmet()`, `sanitizeFilter`
- [ ] T013 [back] Team cap 50 → 422 in `createTeam`
- [ ] T014 [back] Rate limiters keyed by `x-client-ip` (set by the Worker) (test with a low limit via env in test)

## Phase 3: US1 — Restore defaults (P1)
- [ ] T020 [back] Failing test: reset replaces collection with exactly the 11 defaults
- [ ] T021 [back] `defaultTeams.ts` (validated at startup) + `POST /teams/reset` + README
- [ ] T022 [front] Failing test: "Restore teams" button → calls API, list shows returned teams, success toast; error toast on failure
- [ ] T023 [front] `TeamsClient.resetTeams`, button in `TeamsPage`

## Phase 4: US3 — Form guides valid input (P2)
- [ ] T030 [front] Form constraints mirroring FR-002; 400 → "invalid data" toast; tests

## Phase 5: Polish & verification
- [ ] T040 Both repos: branch → CI green (Testing + Code audit) → fast-forward `main`
- [ ] T041 Deploy back (Dokploy) and front (Netlify auto); prod smoke SC-001/SC-002 with curl
