<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Update Project: {{ $project->name }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow">
                    <div class="card-header bg-warning text-dark">
                        <h3 class="mb-0"><i class="bi bi-pencil-square me-2"></i>Update Project: {{ $project->code }}</h3>
                    </div>
                    <div class="card-body">
                        @if ($errors->any())
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Terjadi kesalahan:</strong>
                                <ul class="mb-0 mt-2">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        @endif

                        <form id="projectForm" action="{{ route('projects.update', $project->id) }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            @method('PUT')
                            
                            <!-- Hidden inputs for deleted items -->
                            <div id="deletedItemsContainer"></div>

                            <!-- Informasi Dasar Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Informasi Dasar</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Nama Project <span class="text-danger">*</span></label>
                                        <input type="text" name="name" class="form-control" value="{{ old('name', $project->name) }}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Nama Client <span class="text-danger">*</span></label>
                                        <input type="text" name="client" class="form-control" value="{{ old('client', $project->client) }}" required>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Tipe Project <span class="text-danger">*</span></label>
                                        <select name="project_type" class="form-select" required>
                                            <option value="">-- Pilih Tipe Project --</option>
                                            <option value="research" {{ old('project_type', $project->project_type) == 'research' ? 'selected' : '' }}>Research</option>
                                            <option value="development" {{ old('project_type', $project->project_type) == 'development' ? 'selected' : '' }}>Development</option>
                                            <option value="consulting" {{ old('project_type', $project->project_type) == 'consulting' ? 'selected' : '' }}>Consulting</option>
                                            <option value="training" {{ old('project_type', $project->project_type) == 'training' ? 'selected' : '' }}>Training</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Divisi</label>
                                        <select name="division_id" class="form-select">
                                            <option value="">-- Pilih Divisi --</option>
                                            @foreach($divisions as $division)
                                                <option value="{{ $division->id }}" {{ old('division_id', $project->division_id) == $division->id ? 'selected' : '' }}>{{ $division->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Account Manager</label>
                                        <select name="account_manager_id" class="form-select">
                                            <option value="">-- Pilih Account Manager --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" {{ old('account_manager_id', $project->account_manager_id) == $user->id ? 'selected' : '' }}>{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Head</label>
                                        <select name="head_id" class="form-select">
                                            <option value="">-- Pilih Head --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" {{ old('head_id', $project->head_id) == $user->id ? 'selected' : '' }}>{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">PIC (Person In Charge)</label>
                                        <select name="pic_id" class="form-select">
                                            <option value="">-- Pilih PIC --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" {{ old('pic_id', $project->pic_id) == $user->id ? 'selected' : '' }}>{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Status</label>
                                        <select name="status" class="form-select">
                                            <option value="">-- Pilih Status --</option>
                                            <option value="draft" {{ old('status', $project->status) == 'draft' ? 'selected' : '' }}>Draft</option>
                                            <option value="submitted" {{ old('status', $project->status) == 'submitted' ? 'selected' : '' }}>Submitted</option>
                                            <option value="active" {{ old('status', $project->status) == 'active' ? 'selected' : '' }}>Active</option>
                                            <option value="finished" {{ old('status', $project->status) == 'finished' ? 'selected' : '' }}>Finished</option>
                                            <option value="archived" {{ old('status', $project->status) == 'archived' ? 'selected' : '' }}>Archived</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea name="description" class="form-control" rows="3">{{ old('description', $project->description) }}</textarea>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Total Budget</label>
                                        <input type="number" name="budget_total" class="form-control" step="0.01" min="0" value="{{ old('budget_total', $project->budget_total) }}">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Scope of Work (SOW)</label>
                                    <textarea name="sow" class="form-control" rows="4">{{ old('sow', $project->sow) }}</textarea>
                                </div>
                            </div>

                            <!-- Lokasi Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Lokasi Project</h5>
                                <div id="locationsContainer">
                                    @foreach($project->locations as $index => $location)
                                    <div class="location-item border rounded p-3 mb-3 bg-light" data-id="{{ $location->id }}">
                                        <input type="hidden" name="locations[{{ $index }}][id]" value="{{ $location->id }}">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label class="form-label">Latitude</label>
                                                <input type="text" name="locations[{{ $index }}][latitude]" class="form-control" value="{{ $location->latitude }}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Longitude</label>
                                                <input type="text" name="locations[{{ $index }}][longitude]" class="form-control" value="{{ $location->longitude }}">
                                            </div>
                                            <div class="col-md-5">
                                                <label class="form-label">Alamat Detail</label>
                                                <input type="text" name="locations[{{ $index }}][detail_address]" class="form-control" value="{{ $location->detail_address }}">
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-location" data-type="locations">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                <button type="button" id="addLocation" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Lokasi
                                </button>
                            </div>

                            <!-- Dokumen Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Dokumen Project</h5>
                                <div id="documentsContainer">
                                    @foreach($project->documents as $index => $document)
                                    <div class="document-item border rounded p-3 mb-3 bg-light" data-id="{{ $document->id }}">
                                        <input type="hidden" name="documents[{{ $index }}][id]" value="{{ $document->id }}">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <label class="form-label">File (Biarkan kosong jika tidak diubah)</label>
                                                <input type="file" name="documents[{{ $index }}][file]" class="form-control">
                                                <small class="text-muted d-block">Current: <a href="{{ Storage::url($document->path) }}" target="_blank">{{ $document->original_name }}</a></small>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Tipe Dokumen</label>
                                                <select name="documents[{{ $index }}][type]" class="form-select">
                                                    @foreach(App\Enums\DocumentType::cases() as $type)
                                                        <option value="{{ $type->value }}" {{ $document->type === $type->value ? 'selected' : '' }}>{{ $type->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-document" data-type="documents">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                <button type="button" id="addDocument" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Dokumen
                                </button>
                            </div>

                            <!-- Budget Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Budget Detail</h5>
                                <div id="budgetsContainer">
                                    @foreach($project->budgets as $index => $budget)
                                    <div class="budget-item border rounded p-3 mb-3 bg-light" data-id="{{ $budget->id }}">
                                        <input type="hidden" name="budgets[{{ $index }}][id]" value="{{ $budget->id }}">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label class="form-label">Kategori</label>
                                                <input type="text" name="budgets[{{ $index }}][category]" class="form-control" value="{{ $budget->category }}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Planned Amount</label>
                                                <input type="number" name="budgets[{{ $index }}][planned_amount]" class="form-control" step="0.01" min="0" value="{{ $budget->planned_amount }}">
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label">Actual Amount</label>
                                                <input type="number" name="budgets[{{ $index }}][actual_amount]" class="form-control" step="0.01" min="0" value="{{ $budget->actual_amount }}">
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-budget" data-type="budgets">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                <button type="button" id="addBudget" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Budget
                                </button>
                            </div>

                            <!-- Milestones Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Milestones Project</h5>
                                <div id="milestonesContainer">
                                    @foreach($project->milestones as $index => $milestone)
                                    <div class="milestone-item border rounded p-3 mb-3 bg-light" data-id="{{ $milestone->id }}">
                                        <input type="hidden" name="milestones[{{ $index }}][id]" value="{{ $milestone->id }}">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label class="form-label">Judul Milestone</label>
                                                <input type="text" name="milestones[{{ $index }}][title]" class="form-control" value="{{ $milestone->title }}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Target Tanggal</label>
                                                <input type="date" name="milestones[{{ $index }}][target_date]" class="form-control" value="{{ $milestone->target_date ? \Carbon\Carbon::parse($milestone->target_date)->format('Y-m-d') : '' }}">
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Actual Date</label>
                                                <input type="date" name="milestones[{{ $index }}][actual_date]" class="form-control" value="{{ $milestone->actual_date ? \Carbon\Carbon::parse($milestone->actual_date)->format('Y-m-d') : '' }}">
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Status</label>
                                                <select name="milestones[{{ $index }}][status]" class="form-select">
                                                    @foreach(App\Enums\MilestoneStatus::cases() as $status)
                                                        <option value="{{ $status->value }}" {{ $milestone->status === $status->value ? 'selected' : '' }}>{{ $status->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-milestone" data-type="milestones">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <label class="form-label">Deskripsi</label>
                                                <textarea name="milestones[{{ $index }}][description]" class="form-control" rows="2">{{ $milestone->description }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                <button type="button" id="addMilestone" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Milestone
                                </button>
                            </div>

                            <!-- Project Issues -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Project Issues</h5>
                                <div id="issuesContainer">
                                    @foreach($project->issues as $index => $issue)
                                    <div class="issue-item border rounded p-3 mb-3 bg-light" data-id="{{ $issue->id }}">
                                        <input type="hidden" name="issues[{{ $index }}][id]" value="{{ $issue->id }}">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label class="form-label">Judul Issue</label>
                                                <input type="text" name="issues[{{ $index }}][title]" class="form-control" value="{{ $issue->title }}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Owner</label>
                                                <select name="issues[{{ $index }}][owner_id]" class="form-select">
                                                    <option value="">-- Pilih Owner --</option>
                                                    @foreach($users as $user)
                                                        <option value="{{ $user->id }}" {{ $issue->owner_id == $user->id ? 'selected' : '' }}>{{ $user->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Severity</label>
                                                <select name="issues[{{ $index }}][severity]" class="form-select">
                                                    @foreach(App\Enums\IssueSeverity::cases() as $severity)
                                                        <option value="{{ $severity->value }}" {{ $issue->severity === $severity->value ? 'selected' : '' }}>{{ $severity->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Status</label>
                                                <select name="issues[{{ $index }}][status]" class="form-select">
                                                    @foreach(App\Enums\IssueStatus::cases() as $status)
                                                        <option value="{{ $status->value }}" {{ $issue->status === $status->value ? 'selected' : '' }}>{{ $status->name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-issue" data-type="issues">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <label class="form-label">Deskripsi</label>
                                                <textarea name="issues[{{ $index }}][description]" class="form-control" rows="2">{{ $issue->description }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                <button type="button" id="addIssue" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Issue
                                </button>
                            </div>

                            <!-- Form Actions -->
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <a href="{{ route('projects.index') }}" class="btn btn-secondary">
                                    <i class="bi bi-x-circle me-1"></i>Batal
                                </a>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle me-1"></i>Update Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let locationIndex = {{ $project->locations->count() }};
        let documentIndex = {{ $project->documents->count() }};
        let budgetIndex = {{ $project->budgets->count() }};
        let milestoneIndex = {{ $project->milestones->count() }};
        let issueIndex = {{ $project->issues->count() }};

        // Add Location
        document.getElementById('addLocation').addEventListener('click', function() {
            const container = document.getElementById('locationsContainer');
            const div = document.createElement('div');
            div.className = 'location-item border rounded p-3 mb-3 bg-light';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">Latitude</label>
                        <input type="text" name="locations[${locationIndex}][latitude]" class="form-control" placeholder="-6.200000">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Longitude</label>
                        <input type="text" name="locations[${locationIndex}][longitude]" class="form-control" placeholder="106.816666">
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Alamat Detail</label>
                        <input type="text" name="locations[${locationIndex}][detail_address]" class="form-control">
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-location" data-type="locations">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            locationIndex++;
        });

        // Add Document
        document.getElementById('addDocument').addEventListener('click', function() {
            const container = document.getElementById('documentsContainer');
            const div = document.createElement('div');
            div.className = 'document-item border rounded p-3 mb-3 bg-light';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-5">
                        <label class="form-label">File</label>
                        <input type="file" name="documents[${documentIndex}][file]" class="form-control">
                        <small class="text-muted">Max: 10MB</small>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Tipe Dokumen</label>
                        <select name="documents[${documentIndex}][type]" class="form-select">
                            <option value="">-- Pilih Tipe --</option>
                            @foreach(App\Enums\DocumentType::cases() as $type)
                            <option value="{{ $type->value }}">{{ $type->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-document" data-type="documents">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            documentIndex++;
        });

        // Add Budget
        document.getElementById('addBudget').addEventListener('click', function() {
            const container = document.getElementById('budgetsContainer');
            const div = document.createElement('div');
            div.className = 'budget-item border rounded p-3 mb-3 bg-light';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Kategori</label>
                        <input type="text" name="budgets[${budgetIndex}][category]" class="form-control" placeholder="e.g., Operasional">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Planned Amount</label>
                        <input type="number" name="budgets[${budgetIndex}][planned_amount]" class="form-control" step="0.01" min="0">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Actual Amount</label>
                        <input type="number" name="budgets[${budgetIndex}][actual_amount]" class="form-control" step="0.01" min="0" value="0">
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-budget" data-type="budgets">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            budgetIndex++;
        });

        // Add Milestone
        document.getElementById('addMilestone').addEventListener('click', function() {
            const container = document.getElementById('milestonesContainer');
            const div = document.createElement('div');
            div.className = 'milestone-item border rounded p-3 mb-3 bg-light';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Judul Milestone</label>
                        <input type="text" name="milestones[${milestoneIndex}][title]" class="form-control" placeholder="e.g., Kick Off Meeting">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Target Tanggal</label>
                        <input type="date" name="milestones[${milestoneIndex}][target_date]" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Actual Date</label>
                        <input type="date" name="milestones[${milestoneIndex}][actual_date]" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Status</label>
                        <select name="milestones[${milestoneIndex}][status]" class="form-select">
                            <option value="">-- Pilih --</option>
                            @foreach(App\Enums\MilestoneStatus::cases() as $status)
                            <option value="{{ $status->value }}">{{ $status->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-milestone" data-type="milestones">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="col-md-12 mt-2">
                        <label class="form-label">Deskripsi</label>
                        <textarea name="milestones[${milestoneIndex}][description]" class="form-control" rows="2"></textarea>
                    </div>
                </div>
            `;
            container.appendChild(div);
            milestoneIndex++;
        });

        // Add Issue
        document.getElementById('addIssue').addEventListener('click', function() {
            const container = document.getElementById('issuesContainer');
            const div = document.createElement('div');
            div.className = 'issue-item border rounded p-3 mb-3 bg-light';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Judul Issue</label>
                        <input type="text" name="issues[${issueIndex}][title]" class="form-control">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Owner</label>
                        <select name="issues[${issueIndex}][owner_id]" class="form-select">
                            <option value="">-- Pilih Owner --</option>
                            @foreach($users as $user)
                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Severity</label>
                        <select name="issues[${issueIndex}][severity]" class="form-select">
                            @foreach(App\Enums\IssueSeverity::cases() as $severity)
                            <option value="{{ $severity->value }}">{{ $severity->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Status</label>
                        <select name="issues[${issueIndex}][status]" class="form-select">
                            @foreach(App\Enums\IssueStatus::cases() as $status)
                            <option value="{{ $status->value }}">{{ $status->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-issue" data-type="issues">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="col-md-12 mt-2">
                        <label class="form-label">Deskripsi</label>
                        <textarea name="issues[${issueIndex}][description]" class="form-control" rows="2"></textarea>
                    </div>
                </div>
            `;
            container.appendChild(div);
            issueIndex++;
        });

        // Remove handlers
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('button');
            if (btn && (
                btn.classList.contains('remove-location') || 
                btn.classList.contains('remove-document') || 
                btn.classList.contains('remove-budget') || 
                btn.classList.contains('remove-milestone') ||
                btn.classList.contains('remove-issue')
            )) {
                // Check if existing item (has data-id)
                const item = btn.closest('.location-item, .document-item, .budget-item, .milestone-item, .issue-item');
                const id = item.dataset.id;
                const type = btn.dataset.type; // locations, documents, etc.

                if (id) {
                    // Create hidden input for deleted item
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `delete_${type}[]`;
                    input.value = id;
                    document.getElementById('deletedItemsContainer').appendChild(input);
                }
                
                item.remove();
            }
        });
    </script>
</body>
</html>
