# Raceinator Constitution

## Core Principles

### I. Untrusted input at the boundary
Every request body, param and query is validated against a strict schema before it reaches Mongoose. Unknown keys are rejected, never stripped silently. Operators (`$…`) can never reach a query.

### II. Defaults are data, not code
The default teams live in `data/teams2026.json`. Code reads that file; it never hardcodes team names.

### III. Test-first
Each behavior (validation rule, endpoint, UI action) gets a failing test before its implementation. CI (`Testing`, `Code audit`) must be green before a commit reaches `main`.

### IV. Small and boring
No new dependency when a few lines do it; no abstraction with one implementation.

## Workflow
Direct push to `main` after green CI on a branch (fast-forward). Conventional commits in English. `npm audit` stays at 0.

**Version**: 1.0.0 | **Ratified**: 2026-10-23 | **Last Amended**: 2026-10-23
