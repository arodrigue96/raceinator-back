# Feature Specification: Default teams reset + input hardening

**Feature Branch**: `001-default-teams-reset-hardening`
**Created**: 2026-10-23
**Status**: Clarified
**Input**: «quiero tener los datos por defecto prestablecidos que se puedan reiniciar en cada uno de los momentos y tener correctamente protegidos los forms que no me hagan injection al raceinator back»

## Clarifications

### Session 2026-10-23
- Q: How is the reset triggered? → A: A public "Restore teams" button in the web app; anyone can press it.
- Q: Who can create/delete teams? → A: Anyone, with strict validation and rate limiting.
- Q: Can default teams be deleted? → A: Yes; reset restores exactly the 11 defaults and removes everything else.

## User Scenarios & Testing

### User Story 1 - Restore the default grid (Priority: P1)
A visitor finds the list messed up (teams deleted or junk added) and presses "Restore teams". The list shows exactly the 11 default 2026 teams again.

**Independent Test**: delete two teams and add one, press the button → 11 default teams, none of the added ones.

**Acceptance Scenarios**:
1. **Given** any state of the collection, **When** `POST /teams/reset`, **Then** 200 with the 11 default teams and the collection contains only them.
2. **Given** the teams page, **When** the user presses "Restore teams", **Then** a loader shows, the list refreshes with 11 teams and a success toast appears.
3. **Given** the reset fails, **When** the user presses the button, **Then** an error toast appears and the list is unchanged.

### User Story 2 - Injection-proof writes (Priority: P1)
An attacker sends crafted payloads (Mongo operators, extra fields, huge bodies, bad ids, script URLs) to the API or through the form. Nothing reaches the database except well-formed teams.

**Independent Test**: send each payload of the abuse list with curl → 400 (or 413/429), DB unchanged.

**Acceptance Scenarios**:
1. **Given** a body with `{"name": {"$gt": ""}}` or any non-string where a string is expected, **Then** 400.
2. **Given** a body with unknown keys (e.g. `_id`, `$where`, `__proto__`), **Then** 400.
3. **Given** `imageUrl` that is not `https://…` nor `/images/teams/<file>.webp` (e.g. `javascript:alert(1)`, `http://…`), **Then** 400.
4. **Given** a `:id` that is not a 24-hex ObjectId, **Then** 400 on GET and DELETE.
5. **Given** a body over 10 kB, **Then** 413.
6. **Given** more than the write limit from one client in the window, **Then** 429.
7. **Given** the collection already holds the maximum number of teams, **When** creating, **Then** 409/422-style rejection (no unbounded growth).

### User Story 3 - Form guides valid input (Priority: P2)
The add-team form prevents obviously invalid input before sending (lengths, ranges, URL format) and shows the API's validation message if the server rejects it.

**Acceptance Scenarios**:
1. **Given** a name longer than 60 characters, **Then** the form doesn't allow submitting it.
2. **Given** a debut year above the current year, **Then** the form doesn't submit.
3. **Given** the API answers 400, **Then** an error toast explains the data is invalid.

### Edge Cases
- Reset while another user is adding a team: the result is the 11 defaults (last write wins).
- Duplicate team name → 409 (existing behavior kept).
- Default teams' `imageUrl` are relative paths, served by the front itself; they keep working if the front domain changes.

## Requirements

### Functional Requirements
- **FR-001**: `POST /teams/reset` replaces the collection with the contents of `data/teams2026.json` and returns `{ teams }`.
- **FR-002**: Create validates: `name` 2-60 chars trimmed; `ridersNames` 1-4 items, 2-60 chars each; `championshipTitles` integer 0-99; `debutYear` integer 1949-current year; `imageUrl` ≤ 500 chars, `https://` URL or `/images/teams/[a-z0-9-]+\.webp`; `altImageText` 2-150; `description` 10-1000; `isOfficialTeam` boolean. Unknown keys → 400.
- **FR-003**: `:id` params must be a valid ObjectId → otherwise 400.
- **FR-004**: JSON body limit 10 kB → 413.
- **FR-005**: Rate limit per client IP (`x-client-ip` set by the Worker, else socket IP): writes (POST/DELETE) 30 per 15 min; reset 10 per 15 min → 429.
- **FR-006**: Maximum 50 teams; creating beyond → 422.
- **FR-007**: Mongoose `sanitizeFilter` on; security headers (helmet).
- **FR-008**: Front: "Restore teams" button on the teams page; form inputs carry `maxLength`, `min`/`max`, `type="url"`-compatible pattern; 400 from the API shows a validation error toast.
- **FR-009**: Default teams seed is the single source of truth (`data/teams2026.json`), also used by the README loading script.

## Success Criteria
- **SC-001**: After reset, `GET /teams` returns exactly the 11 defaults (verified in prod).
- **SC-002**: Every payload of the abuse list returns 4xx and leaves the count unchanged (verified in prod with curl).
- **SC-003**: `npm audit` 0 and CI green in both repos.
