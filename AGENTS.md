# AI Guidelines — Socio Impact Dashboard

## Scope and sources

This root guide applies to this repository. Follow explicit task instructions and more specific directory guidance. Inspect the affected implementation and sibling files before editing; preserve unrelated working-tree changes. Keep changes scoped to the requested behavior.

Reviewed on 2026-10-21 against local source and the latest publicly retrievable upstream `main`:

- [Upstream agent guidelines](https://github.com/nunomaduro/laravel-starter-kit-inertia-react/blob/main/AGENTS.md)
- [Upstream PHP manifest](https://github.com/nunomaduro/laravel-starter-kit-inertia-react/blob/main/composer.json)
- [Upstream frontend manifest](https://github.com/nunomaduro/laravel-starter-kit-inertia-react/blob/main/package.json)

These are moving references; an exact upstream commit was not verified. Upstream now targets PHP 8.5, Laravel 13, Inertia 3, Pest 5, Boost 2, and Bun/Vite+ with Oxlint/Oxfmt. **This checkout has not adopted that stack.** Use the local manifests, lockfiles, configuration, and implementation as authority. Do not migrate dependencies or tooling as a side effect of feature work.

Local `.ai/guidelines/app.actions.blade.php` and `.ai/guidelines/general.blade.php` contain the project's action and PHP conventions. `CLAUDE.md` and `GEMINI.md` contain additional generated guidance; verify version and tool claims against the checkout. Upstream skills and MCP tools are not automatically installed here: use them only when available, with ordinary source inspection as the fallback.

## Local stack and application map

The local manifests declare PHP `^8.4.0`, Laravel `^12.50.0`, Inertia Laravel `^2.0.19`, Inertia React `^2.3.17`, React 19, TypeScript 5.9, Tailwind CSS 4, and Vite 7. They also include Fortify, Sanctum 4, Spatie Permission 6, Laravel Excel, Wayfinder, Ziggy, and Essentials. Development uses Pest 4, Larastan/PHPStan, Rector, Pint, ESLint 9, and Prettier 3. These are dependency requirements, not a claim about the running server; consult lockfiles and installed packages for exact versions.

This is an operational dashboard for projects and budgets, ATR/EER/allowance reimbursements, attendance, leave/travel approvals, letters, calendars, notifications, users, divisions, and KPIs.

| Location | Responsibility |
| --- | --- |
| `bootstrap/app.php` | Routing and web/API middleware registration |
| `routes/web.php` | Inertia pages, session authentication, settings, administration |
| `routes/api.php` | `/api/v1` business endpoints and `/api/rbac` role/permission endpoints |
| `app/Http/Controllers` | Web entry points; `Admin` and `Api/V1` contain separate workflows |
| `app/Http/Requests` | Validation and request authorization; inspect the exact imported class |
| `app/Actions` | Reusable business operations, including `Projects` and `Calendar` subdirectories |
| `app/Services` | Shared reimbursement, leave, attendance, user, and upload behavior |
| `app/Models`, `app/Enums`, `app/Policies` | Persistence, stored enum values, authorization helpers |
| `app/Http/Resources` | API serialization contracts |
| `resources/js/pages` | Inertia screens; preserve exact directory/file casing |
| `resources/js/components`, `resources/js/layouts`, `resources/js/hooks` | Shared UI and behavior |
| `resources/js/types` | Frontend data contracts |
| `database/migrations`, `database/factories`, `database/seeders` | Schema evolution and fixtures |
| `tests/Feature`, `tests/Unit`, `tests/Browser` | Existing regression and browser coverage |

## Backend conventions

- Use `declare(strict_types=1);`, explicit parameter/property/return types, and useful array/collection generics. Follow `pint.json` and `rector.php`; prefer final classes and readonly dependencies where appropriate. Do not make mutable Eloquent models readonly.
- Put reusable business logic in actions with a single `handle()` entry point and private constructor-injected dependencies. Prefer verb-based names without an `Action` suffix for new actions, while preserving existing names and call sites.
- Follow existing services instead of duplicating calculations in controllers. Keep controllers focused on authorization, validated input, orchestration, and response shaping.
- Use `DB::transaction()` for related database writes. Filesystem changes are not rolled back by database transactions; handle upload/replacement/deletion failures explicitly when modifying these flows.
- `AppServiceProvider` calls `Model::unguard()`. Explicitly select validated writable fields; never pass arbitrary request input into model creation/update. Ownership, approval, and accounting fields need server-side control.
- Prefer typed Eloquent relationships and query builders; load relationships needed by resources and lists without introducing N+1 queries.
- Add forward migrations for schema changes. Editing an already-applied migration does not repair existing databases. Preserve soft-delete behavior and related-record lifecycle rules.
- Keep PHPDoc focused on useful type information and non-obvious intent. Avoid redundant commentary.

## Authorization and workflow contracts

- Web business routes generally use `auth` and `verified`; settings have their own groups. API v1 uses `auth:web,sanctum`, while RBAC uses `auth:sanctum` plus `can:view-admin`. Preserve these distinctions and stateful Sanctum handling in `bootstrap/app.php`.
- `adminAccess` and `view-admin` gates permit the `superadmin` and `hr` roles. Use `UserRole` and Spatie role/permission methods; do not replace these with an invented numeric hierarchy.
- Authentication alone does not prove access to an object. Trace controller checks, request authorization, actions, query scopes, and policies. `ProjectPolicy` and `LeavePolicy` contain deny-all stubs; their existence does not mean they implement the live workflow.
- Preserve ownership and role filters in list/detail/export/mutation paths. `tests/Feature/Api/V1/ProjectVisibilityTest.php` covers project visibility and is a starting point when changing project access.
- Impersonation depends on session key `impersonated_by`, shared Inertia state, and `EnsureSessionValid`. Preserve restoration behavior and test unauthorized attempts; see `tests/Feature/Admin/ImpersonationTest.php`.
- Projects bind URLs using `uuid` via `Project::getRouteKeyName()`. Do not substitute internal numeric IDs in project URLs. Verify each other model's own binding rules separately.
- Reimbursement and leave approvals are multi-stage workflows. Inspect their actions, services, enum values, approver relationships, and bulk operations together. Preserve distinctions such as `revision` versus `revised`, and reimbursement `request_fund` versus `transferred`.
- Current project year claims use `year` and one decimal `amount`, as defined in `ProjectYearClaim` and project requests. `project-year-claims.md` describes older budget-partition fields and is not the current schema contract.
- Preserve letter numbering and logs, monetary precision, document metadata, and notification recipients when touching their workflows. Use existing feature tests for leave sequencing, letter numbering/logs, and reimbursement deletion as regression references.
- `JsonResponseFormatter` wraps successful data in `data` and optionally `message`; error responses use `message` and optional `errors`. Inspect actual resources/pagination before changing consumers: nested collection data can be intentional.

## Frontend conventions

- Use the existing Inertia 2 React APIs. Resolve pages through `resources/js/app.tsx`; preserve casing such as `Projects/Show` and `admin/users` for Linux deployments.
- Reuse shared components and `components/ui` primitives. Follow `DESIGN.md` and actual CSS tokens in `resources/css/app.css`: dense, responsive layouts, accessible controls, and scrollable mobile menus/dialogs.
- Use TypeScript interfaces/types for props, forms, and responses. Keep them aligned with requests/resources/shared Inertia data; do not hide mismatches with `any` or broad assertions.
- Shared auth data comes from `HandleInertiaRequests`: `user`, `permissions`, `is_impersonating`, and `original_user`. Client-side visibility complements backend authorization.
- Both Ziggy and Wayfinder are used. `app.tsx` exposes Ziggy's `route`; preserve the route helper used by the affected feature. Avoid broad routing rewrites or hardcoded URLs when a named/generated helper exists.
- `resources/js/actions`, `resources/js/routes`, and `resources/js/wayfinder` are generated and ignored. Regenerate with `php artisan wayfinder:generate --with-form` when routes change or generated imports are missing; do not hand-edit generated files. Vite also configures Wayfinder with form variants.
- Follow `.prettierrc`, `eslint.config.js`, and strict `tsconfig.json`; use the `@/` source alias. Preserve existing interface language and domain terminology.
- Trace field changes through create/edit/detail/list screens, form state, request validation, action/service, schema/model, resource, and tests. Check both web and API entry points.

## Commands and verification

Run commands from the repository root. Use the existing npm lockfile and Composer dependencies. The deployment build specifies PHP 8.4 and Node 22; do not infer that either is installed locally.

| Command | Purpose and effects |
| --- | --- |
| `php vendor/bin/pest tests/Feature/Api/V1/ProjectVisibilityTest.php` | Example focused regression test; select tests relevant to the change |
| `composer test:type-coverage` | Pest type coverage, minimum 100% |
| `composer test:unit` | Parallel Pest with exactly 100% code coverage; requires a coverage driver |
| `composer test:lint` | Pint check, Rector dry run, ESLint and Prettier checks |
| `composer test:types` | PHPStan at configured maximum level and TypeScript checking |
| `npm run test:types` | TypeScript check without emission |
| `npm run test:lint` | ESLint and Prettier checks |
| `npm run build` | Client production build; writes generated/build output and invokes Vite plugins |
| `npm run build:ssr` | Client and SSR builds |
| `composer test` | Full configured quality suite; run when scope/environment warrant it |
| `composer lint` | Mutates files using Rector, Pint, ESLint, and Prettier |
| `npm run lint` | Mutates frontend files using ESLint fixes and Prettier |
| `composer dev` | Starts server on port 8001, queue listener, Pail helper, and Vite |

`phpunit.xml` configures SQLite `:memory:`, array cache/session/mail, and synchronous queues. `tests/Pest.php` applies `RefreshDatabase`, freezes time, and prevents stray HTTP/process calls. Confirm the effective test connection is isolated, especially with cached config or shell overrides. Fake storage/notifications and external boundaries as appropriate; never run database-refresh tests against shared data.

For behavior changes, run focused tests first, including unauthorized access, ownership boundaries, invalid input, and invalid state transitions where relevant. Run static checks/builds appropriate to the files changed. Distinguish existing failures from regressions; do not weaken coverage or typing rules to hide failures. The configured coverage thresholds are targets, not evidence that this application currently passes them.

For documentation-only work, verify referenced paths/commands, inspect the diff, and run `git diff --check`; application startup and database operations are unnecessary. Report checks actually run, failures, and skipped checks with reasons. A build is not browser, deployment, or live-database verification.

## Environment and delivery boundaries

- Do not print or commit `.env`, credentials, tokens, private keys, or personal data. Use configuration access in application code; inspect only necessary non-secret settings when diagnosing configuration.
- `composer setup` installs dependencies, generates the application key, and runs forced migrations. Use it only for an intended setup task against the intended environment. Do not reset keys or databases as routine verification.
- `composer update` runs post-update hooks, including `update:requirements`, which can rewrite dependency requirements. Do not run it to validate an unrelated change.
- `.gitignore` includes database config, manifests/lockfiles, generated routes, and build outputs. Already tracked files remain tracked: inspect `git status` and diffs, and preserve existing changes rather than assuming ignored paths are disposable.
- `.github/workflows/deploy-build.yml` is a build/deployment workflow, not proof of a passing test suite. Pushing its configured source branch can force-push build artifacts and deploy over SSH. Inspect it before any requested publishing operation; do not reproduce deployment commands for local verification.
- Finish with a concise explanation of the change, relevant verification results, and remaining limitations. Leave unrelated files and unrequested runtime/dependency changes untouched.
