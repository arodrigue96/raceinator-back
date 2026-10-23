# Implementation Plan: Default teams reset + input hardening

**Branch**: `001-default-teams-reset-hardening` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

## Summary
Back: a `POST /teams/reset` that replaces the collection with `data/teams2026.json`, and a validation layer (Zod, strict) in front of every write, plus body limit, ObjectId checks, rate limit, team cap, helmet and Mongoose `sanitizeFilter`. Front (`raceinator-front`): a "Restore teams" button on the teams page and form constraints that mirror the server rules.

## Technical Context
- Back: Node 22, Express 5, Mongoose 9, Jest 29 + supertest + mongodb-memory-server (tests run in CI only).
- Front: React 18, Vite 8, Redux Toolkit, Vitest 5 + Testing Library + MSW.
- Deploy: back on Dokploy (`raceinator-back-ymg64c`), front on Netlify (`raceinator`), API behind the Worker `raceinator-api.aniol-rodriguez.workers.dev` (forwards `CF-Connecting-IP`).

## Constitution Check
- I. Untrusted input → Zod `.strict()` schemas at the router; `sanitizeFilter` as second layer ✅
- II. Defaults are data → reset reads `data/teams2026.json` ✅
- III. Test-first → each rule gets a failing supertest/vitest first ✅
- IV. Small → new deps only `zod`, `express-rate-limit`, `helmet` (each replaces > 50 lines of hand-rolled code) ✅

## Design
- `src/team/schemas/teamSchema.ts` (Zod): `teamBodySchema` (FR-002) and `teamIdParamsSchema` (24-hex).
- `src/server/middlewares/validate.ts`: `validate({ body?, params? })` → 400 `{ message }` with the first issue.
- `src/server/middlewares/rateLimits.ts`: `writeLimiter` (30/15 min), `resetLimiter` (10/15 min); `keyGenerator` = `x-client-ip` header (set by the Worker from `cf-connecting-ip`, overwriting any client value; the origin only accepts Cloudflare IPs) || `req.ip`.
- `src/team/controller/TeamsController.ts`: `resetTeams` (`deleteMany({})` + `insertMany(defaults)`), `createTeam` checks `countDocuments() >= 50` → 422.
- `src/team/defaultTeams.ts`: loads and validates `data/teams2026.json` once at startup (fails fast if the file is invalid).
- `src/server/index.ts`: `helmet()`, `express.json({ limit: "10kb" })`, routes; `handleGeneralErrors` maps body-parser 413 and `entity.parse.failed` to 413/400.
- `mongoose.set("sanitizeFilter", true)` in `connectToDatabase`.
- Front: `TeamsClient.resetTeams()`, `teamsSlice` action `loadTeams` reused, `RestoreTeamsButton` in `TeamsPage`; `TeamForm` inputs with `maxLength`/`minLength`/`min`/`max`/`pattern`; client maps 400 → "invalid data" toast.

## Test plan
- Back supertest: reset returns 11 and removes extras; each abuse payload of spec US2 → 400/413/422/429; valid team → 201.
- Front vitest: button calls reset and renders 11 teams; error path toast; form attributes present.
- Prod smoke (curl): SC-001 and SC-002.
