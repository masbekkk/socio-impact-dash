# Step 0 — Repo Audit: Dashboard Monitoring Project

**Date**: 2026  
**Purpose**: Identify what exists vs missing for PDF "Dashboard Monitoring Project" (projects monitoring, reminders/calendar, ATR/EER approvals, HR requests, dashboards).

---

## 1. Controllers (`app/Http/Controllers`)

| Controller | Exists | Notes |
|------------|--------|--------|
| ProjectController | ✅ | CRUD + finish; no initial/monthly/completion submit flows |
| ReimbursementController | ✅ | index, create, store, show, approvals, approve, reject — ATR/EER |
| LeaveController | ✅ | resource + approvals, approve |
| PresenceController | ✅ | index, check-in |
| Admin\UserController | ✅ | resource |
| Admin\DivisionController | ✅ | resource |
| ApprovalsController (dedicated) | ❌ | Approvals live on ReimbursementController, LeaveController |
| ReminderController / Calendar | ❌ | — |
| DashboardController (exec/division) | ❌ | Dashboard route renders 'dashboard' inline |

**Action**: Enhance existing controllers; add approval inbox views if missing; add dashboard data endpoints.

---

## 2. Services / Actions (`app/Services`, `app/Actions`)

| Item | Exists | Notes |
|------|--------|--------|
| ProjectService | ✅ | In Services |
| CreateProject, UpdateProject, DeleteProject, FinishProject | ✅ | Actions |
| CreateReimbursement, ApproveReimbursement, RejectReimbursement | ✅ | Actions |
| CreateLeave, ApproveLeave, RejectLeave | ✅ | Actions |
| CheckInPresence | ✅ | Action |
| Monthly monitoring submit / Completion submit | ❌ | — |
| Reminder / early warning creation | ❌ | — |

**Action**: Add actions for project submissions (initial/monthly/completion), reminders, early warning.

---

## 3. Models (`app/Models`)

| Model | Exists | Notes |
|-------|--------|--------|
| User | ✅ | role, employee_type, contract dates; missing division_id, nip, position, join_date, phone, location, address |
| Division | ✅ | code, name, description |
| Project | ✅ | code, name, client, division_id, account_manager_id, head_id, pic_id, status, project_type (string), sow, budget_total; missing pc_id, implementation_pic_id, spk_start_date, spk_end_date, nominal_planned, financial_projection, health, region, notes |
| ProjectMilestone | ✅ | — |
| ProjectBudget | ✅ | — |
| ProjectDocument | ✅ | — |
| ProjectIssue | ✅ | — |
| ProjectLocation | ✅ | — |
| Reimbursement | ✅ | ATR/EER flow |
| ReimbursementDocument, ReimbursementApproval | ✅ | — |
| Leave, LeaveApproval | ✅ | — |
| Presence | ✅ | — |
| Notification, NotificationRecipient | ✅ | type includes project_reminder; no due_at |
| ProjectSubmission | ❌ | initial / monthly / completion per project (and per month for monthly) |
| Reminder | ❌ | Separate reminders table (or extend Notification with due_at) |
| RequestBta / OutsideAttendance | ❌ | BTA = business travel; outside_attendance for HR |

**Action**: Add ProjectSubmission, Reminder (or extend notifications); optional BTA/OutsideAttendance models when implementing Step 9.

---

## 4. Enums (`app/Enums`)

| Enum | Exists | Values / Missing |
|------|--------|-------------------|
| UserRole | ✅ | Pegawai, Head, Finance, Superadmin — **missing**: Director, HR, Office_coordinator |
| ProjectStatus | ✅ | Draft, Submitted, Active, Finished, Archived — PDF wants also: not_started, on_track, at_risk, delayed, completed (monitoring) |
| ProjectType | ❌ | **Add**: pendampingan, dokumen, event, pelatihan (currently project_type is string) |
| ProjectHealth | ❌ | **Add**: sehat, waspada, kritis, sangat_kritis |
| ReimbursementStatus | ✅ | Draft, Submitted, HeadApproved, FinanceApproved, Transferred, Rejected |
| ReimbursementType | ✅ | ATR, EER |
| LeaveStatus, LeaveType | ✅ | — |
| DocumentType | ✅ | Proposal, Contract, MoM, Receipt, EER, RAB, etc. |
| RequestStatus (generic for ATR/EER/HR) | ❌ | Optional; ReimbursementStatus / LeaveStatus already cover stages |

**Action**: Add ProjectType, ProjectHealth; extend UserRole (Director, HR, Office_coordinator); optionally extend ProjectStatus for monitoring.

---

## 5. Migrations

| Table / Change | Exists | Missing |
|----------------|--------|--------|
| users | ✅ | **Add columns**: division_id, nip, position, join_date, phone, location, address |
| divisions | ✅ | — |
| projects | ✅ | **Add columns**: pc_id, implementation_pic_id, spk_start_date, spk_end_date, nominal_planned, financial_projection (json), health, region, notes (project_type already exists as string; can cast to ProjectType) |
| project_submissions | ❌ | **New table**: project_id, type (initial/monthly/completion), month (for monthly), kendala, status, nominal, realisasi_anggaran, etc. |
| project_documents | ✅ | — |
| project_milestones, budgets, issues, locations | ✅ | — |
| reimbursements | ✅ | — |
| leaves | ✅ | — |
| presences | ✅ | — |
| notifications | ✅ | Has type, scheduled_at — **optional**: due_at for reminders |
| reminders | ❌ | **New table**: project_id, type, due_at, message, template, sent_at, etc. |
| requests_bta, outside_attendance | ❌ | For Step 9 (HR requests) |

**Action**: Add migration(s) for users columns, projects columns, project_submissions, reminders.

---

## 6. Routes (`routes/web.php`)

| Area | Exists | Notes |
|------|--------|--------|
| projects.* | ✅ | resource + finish |
| reimbursements.* + approvals, approve, reject | ✅ | — |
| leaves.* + approvals, approve | ✅ | — |
| presences.* | ✅ | — |
| admin.users, admin.divisions | ✅ | — |
| dashboard (exec/division with filters) | ⚠️ | Single dashboard route; no exec vs division split |
| project submissions (initial/monthly/completion) | ❌ | — |
| reminders / calendar / .ics | ❌ | — |

**Action**: Add routes for project submissions, reminders, dashboard filters when implementing those steps.

---

## 7. Frontend Pages (`resources/js/Pages`)

| Page | Exists | Notes |
|------|--------|--------|
| Dashboard/Index | ✅ | — |
| Projects/Index, Create, Show | ✅ | Show: Overview, Documents, Submissions, Reminders tabs — verify |
| Reimbursements/Index, CreateATR, CreateEER, Show | ✅ | Approvals page? |
| Leave/Index, CreateLeave, CreateTravel | ✅ | — |
| Presence/Index | ✅ | — |
| Admin (Users, Divisions) | ⚠️ | Controllers exist; check if Inertia pages exist |
| Dashboard (Exec vs Division) | ❌ | Single dashboard |
| OC compliance (missing monitoring) | ❌ | — |
| Calendar / .ics download | ❌ | — |

**Action**: Enhance Projects/Show with Submissions + Reminders tabs; add OC compliance view; add dashboard filters and division scope.

---

## 8. Policies / Authz

| Policy | Exists | Notes |
|--------|--------|--------|
| ProjectPolicy | ✅ | — |
| ReimbursementPolicy | ✅ | — |
| LeavePolicy | ✅ | — |
| Division/User (admin) | ⚠️ | adminAccess gate/can |
| Role rules (employee/head/director/finance/hr/OC) | ⚠️ | Partially; need Director, HR, Office_coordinator rules |

**Action**: Implement Step 2 (Authz): extend policies for Director/HR/OC; head approves division + project submissions; finance ATR/EER; HR HR flows; OC view all projects + reminders.

---

## 9. Summary: Exists vs Missing

**Exists (enhance, do not duplicate)**  
- ProjectController, ReimbursementController, LeaveController, PresenceController, Admin controllers  
- Project, Division, User, Reimbursement, Leave, Presence, ProjectDocument, ProjectMilestone, ProjectBudget, ProjectIssue, Notification  
- Enums: UserRole (extend), ProjectStatus (extend optional), ReimbursementStatus/Type, LeaveStatus/Type, DocumentType  
- Routes for projects, reimbursements, leaves, presences, admin  
- Pages: Dashboard, Projects (Index/Create/Show), Reimbursements (Index/CreateATR/CreateEER/Show), Leave, Presence  
- Project table has code, name, client, division_id, account_manager_id, head_id, pic_id, project_type, sow, budget_total  

**Missing (add incrementally)**  
- Enums: ProjectType, ProjectHealth; UserRole cases Director, HR, Office_coordinator  
- Migrations: users (division_id, nip, position, join_date, phone, location, address); projects (pc_id, implementation_pic_id, spk_start_date, spk_end_date, nominal_planned, financial_projection, health, region, notes); project_submissions table; reminders table  
- Models: ProjectSubmission, Reminder  
- Actions: initial/monthly/completion submit, reminder creation, early warning  
- Routes & UI: project submissions, OC compliance, calendar/.ics, dashboard exec/division  
- BTA / outside_attendance (Step 9)  
- Feature tests: ATR approval flow, monthly uniqueness, HR branching  

---

## 10. Next Steps (Order)

1. **Step 1** — Enums (ProjectType, ProjectHealth) + UserRole extension; migrations (users, projects, project_submissions, reminders); models and seeders.  
2. **Step 2** — Policies/Gates for Director, HR, Office_coordinator; middleware/role helpers.  
3. **Step 3** — Projects CRUD + initial submit (proposal + kontrak, project_submission type=initial).  
4. **Step 4** — Monthly monitoring submit + OC compliance view.  
5. **Step 5** — Completion submit.  
6. **Step 6** — Calendar, early warning, reminders (.ics, WhatsApp copy, email preview).  
7. **Step 7** — ATR enhancements (fields + approval inbox).  
8. **Step 8** — EER enhancements.  
9. **Step 9** — HR requests (BTA, Leave branching, outside attendance).  
10. **Step 10** — Dashboards (exec + division).  
11. **Step 11** — Polish, FormRequests, file validation, seed demo accounts, feature tests.
