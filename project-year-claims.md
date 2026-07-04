# Project Year Claims

## Goal
Allow a project to have multiple year-based budget claims (operational, management, allowance) instead of a single set of budget partitions. Each year claim stores the budget allocation for that specific year.

## Tasks

- [ ] **Task 1: Create migration** — `database/migrations/XXXX_XX_XX_create_project_year_claims_table.php`
  - `project_id` (FK), `year` (integer, e.g. 2026), `operational_budget`, `management_budget`, `allowance_budget` (decimal 15,2), timestamps, softDeletes
  - Unique constraint on `(project_id, year)` — one claim per year per project
  - Verify: `php artisan migrate` runs without error

- [ ] **Task 2: Create ProjectYearClaim model** — `app/Models/ProjectYearClaim.php`
  - Fillable: `project_id`, `year`, `operational_budget`, `management_budget`, `allowance_budget`
  - Casts: year (integer), budgets (decimal)
  - Relationship: `project()` belongsTo Project
  - Verify: model resolves, relationship returns correct type

- [ ] **Task 3: Add `yearClaims()` relationship on Project** — `app/Models/Project.php`
  - `hasMany(ProjectYearClaim::class)` ordered by `year` asc
  - Add `ProjectYearClaim` to the `deleting` boot cascade (soft delete + force delete)
  - Verify: `$project->yearClaims` returns collection

- [ ] **Task 4: Update CreateProject action** — `app/Actions/Projects/CreateProject.php`
  - In `handle()`, after creating the project record, sync `year_claims` from the input data
  - Add private `syncYearClaims(Project $project, array $claims, int $userId)`
  - Verify: creating a project with year_claims stores them in DB

- [ ] **Task 5: Update UpdateProject action** — `app/Actions/Projects/UpdateProject.php`
  - In `handle()`, add `year_claims` to sync logic
  - Add private `syncYearClaims()` - handles create/update/delete of claims
  - Add `delete_year_claims` support for removing claims
  - Verify: updating a project's year_claims reflects in DB

- [ ] **Task 6: Update StoreProjectRequest validation** — `app/Http/Requests/Projects/StoreProjectRequest.php`
  - Add rules for `year_claims` (nullable array)
  - `year_claims.*.year` required|integer|min:2000|max:2100
  - `year_claims.*.operational_budget` nullable|numeric|min:0
  - `year_claims.*.management_budget` nullable|numeric|min:0
  - `year_claims.*.allowance_budget` nullable|numeric|min:0
  - Verify: sending invalid year_claims data returns validation errors

- [ ] **Task 7: Update UpdateProjectRequest validation** — `app/Http/Requests/Projects/UpdateProjectRequest.php`
  - Same year_claims rules as StoreProjectRequest
  - Add `year_claims.*.id` (nullable integer for updates)
  - Add `delete_year_claims` (nullable array of integers)
  - Verify: validation works for update requests

- [ ] **Task 8: Update ProjectResource** — `app/Http/Resources/V1/Project/ProjectResource.php`
  - Add `year_claims` whenLoaded with id, year, operational_budget, management_budget, allowance_budget
  - Verify: API response includes year_claims array

## Done When
- [ ] A project can be created with multiple year claims
- [ ] A project can be updated to add/remove/edit year claims
- [ ] The API returns year claims for a project
- [ ] Database migration runs cleanly
- [ ] Existing functionality (budget calculations, remaining_operational) still works

## Notes
- Year claims are independent from the project-level budget partitions — the project-level `operational_budget`/`management_budget`/`allowance_budget` fields remain as the overall budget source of truth
- The year claims act as a per-year breakdown of the project budgets
- Run `vendor/bin/pint --dirty` and `php artisan test --compact --filter=Project` after all changes
