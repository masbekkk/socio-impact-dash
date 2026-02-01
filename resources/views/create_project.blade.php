<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Buat Project Baru</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0"><i class="bi bi-folder-plus me-2"></i>Buat Project Baru</h3>
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

                        <form id="projectForm" action="{{ route('projects.store') }}" method="POST" enctype="multipart/form-data">
                            @csrf

                            <!-- Informasi Dasar Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Informasi Dasar</h5>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Nama Project <span class="text-danger">*</span></label>
                                        <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Nama Client <span class="text-danger">*</span></label>
                                        <input type="text" name="client" class="form-control" value="{{ old('client') }}" required>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Tipe Project <span class="text-danger">*</span></label>
                                        <select name="project_type" class="form-select" required>
                                            <option value="">-- Pilih Tipe Project --</option>
                                            <option value="research">Research</option>
                                            <option value="development">Development</option>
                                            <option value="consulting">Consulting</option>
                                            <option value="training">Training</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Divisi</label>
                                        <select name="division_id" class="form-select">
                                            <option value="">-- Pilih Divisi --</option>
                                            @foreach($divisions as $division)
                                                <option value="{{ $division->id }}">{{ $division->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Account Manager</label>
                                        <select name="account_manager_id" class="form-select">
                                            <option value="">-- Pilih Account Manager --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}">{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Head</label>
                                        <select name="head_id" class="form-select">
                                            <option value="">-- Pilih Head --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}">{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">PIC (Person In Charge)</label>
                                        <select name="pic_id" class="form-select">
                                            <option value="">-- Pilih PIC --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}">{{ $user->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Total Budget</label>
                                        <input type="number" name="budget_total" class="form-control" step="0.01" min="0" value="{{ old('budget_total') }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Status</label>
                                        <select name="status" class="form-select">
                                            <option value="">-- Pilih Status --</option>
                                            <option value="draft" selected>Draft</option>
                                            <option value="submitted">Submitted</option>
                                            <option value="active">Active</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Scope of Work (SOW)</label>
                                    <textarea name="sow" class="form-control" rows="4">{{ old('sow') }}</textarea>
                                </div>
                            </div>

                            <!-- Lokasi Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Lokasi Project</h5>
                                <div id="locationsContainer">
                                    <div class="location-item border rounded p-3 mb-3 bg-light">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label class="form-label">Latitude</label>
                                                <input type="text" name="locations[0][latitude]" class="form-control" placeholder="-6.200000">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Longitude</label>
                                                <input type="text" name="locations[0][longitude]" class="form-control" placeholder="106.816666">
                                            </div>
                                            <div class="col-md-5">
                                                <label class="form-label">Alamat Detail</label>
                                                <input type="text" name="locations[0][detail_address]" class="form-control">
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-location" disabled>
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" id="addLocation" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Lokasi
                                </button>
                            </div>

                            <!-- Dokumen Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Dokumen Project</h5>
                                <div id="documentsContainer">
                                    <div class="document-item border rounded p-3 mb-3 bg-light">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <label class="form-label">File</label>
                                                <input type="file" name="documents[0][file]" class="form-control">
                                                <small class="text-muted">Max: 10MB</small>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Tipe Dokumen</label>
                                                <select name="documents[0][type]" class="form-select">
                                                    <option value="">-- Pilih Tipe --</option>
                                                    <option value="proposal">Proposal</option>
                                                    <option value="contract">Contract</option>
                                                    <option value="mom">MoM</option>
                                                    <option value="receipt">Receipt</option>
                                                    <option value="eer">EER</option>
                                                    <option value="rab">RAB</option>
                                                    <option value="transfer_proof">Transfer Proof</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-document" disabled>
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" id="addDocument" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Dokumen
                                </button>
                            </div>

                            <!-- Budget Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Budget Detail</h5>
                                <div id="budgetsContainer">
                                    <div class="budget-item border rounded p-3 mb-3 bg-light">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label class="form-label">Kategori</label>
                                                <input type="text" name="budgets[0][category]" class="form-control" placeholder="e.g., Operasional">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Planned Amount</label>
                                                <input type="number" name="budgets[0][planned_amount]" class="form-control" step="0.01" min="0">
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label">Actual Amount</label>
                                                <input type="number" name="budgets[0][actual_amount]" class="form-control" step="0.01" min="0" value="0">
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-budget" disabled>
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" id="addBudget" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Budget
                                </button>
                            </div>

                            <!-- Milestones Project -->
                            <div class="mb-4">
                                <h5 class="border-bottom pb-2 mb-3">Milestones Project</h5>
                                <div id="milestonesContainer">
                                    <div class="milestone-item border rounded p-3 mb-3 bg-light">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <label class="form-label">Judul Milestone</label>
                                                <input type="text" name="milestones[0][title]" class="form-control" placeholder="e.g., Kick Off Meeting">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label">Target Tanggal</label>
                                                <input type="date" name="milestones[0][target_date]" class="form-control">
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Actual Date</label>
                                                <input type="date" name="milestones[0][actual_date]" class="form-control">
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label">Status</label>
                                                <select name="milestones[0][status]" class="form-select">
                                                    <option value="">-- Pilih --</option>
                                                    <option value="planned" selected>Planned</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div class="col-md-1 d-flex align-items-end">
                                                <button type="button" class="btn btn-danger btn-sm remove-milestone" disabled>
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <label class="form-label">Deskripsi</label>
                                                <textarea name="milestones[0][description]" class="form-control" rows="2"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" id="addMilestone" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Tambah Milestone
                                </button>
                            </div>

                            <!-- Form Actions -->
                            <div class="d-flex justify-content-end gap-2 mt-4">
                                <a href="{{ route('projects.index') }}" class="btn btn-secondary">
                                    <i class="bi bi-x-circle me-1"></i>Batal
                                </a>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle me-1"></i>Simpan Project
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
        let locationIndex = 1;
        let documentIndex = 1;
        let budgetIndex = 1;
        let milestoneIndex = 1;

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
                        <button type="button" class="btn btn-danger btn-sm remove-location">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            locationIndex++;
            updateRemoveButtons();
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
                            <option value="proposal">Proposal</option>
                            <option value="contract">Contract</option>
                            <option value="mom">MoM</option>
                            <option value="receipt">Receipt</option>
                            <option value="eer">EER</option>
                            <option value="rab">RAB</option>
                            <option value="transfer_proof">Transfer Proof</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-document">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            documentIndex++;
            updateRemoveButtons();
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
                        <button type="button" class="btn btn-danger btn-sm remove-budget">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            budgetIndex++;
            updateRemoveButtons();
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
                            <option value="planned" selected>Planned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm remove-milestone">
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
            updateRemoveButtons();
        });

        // Remove handlers
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-location')) {
                e.target.closest('.location-item').remove();
                updateRemoveButtons();
            }
            if (e.target.closest('.remove-document')) {
                e.target.closest('.document-item').remove();
                updateRemoveButtons();
            }
            if (e.target.closest('.remove-budget')) {
                e.target.closest('.budget-item').remove();
                updateRemoveButtons();
            }
            if (e.target.closest('.remove-milestone')) {
                e.target.closest('.milestone-item').remove();
                updateRemoveButtons();
            }
        });

        // Update remove buttons state
        function updateRemoveButtons() {
            const locations = document.querySelectorAll('.location-item');
            const documents = document.querySelectorAll('.document-item');
            const budgets = document.querySelectorAll('.budget-item');
            const milestones = document.querySelectorAll('.milestone-item');

            locations.forEach((item, index) => {
                const btn = item.querySelector('.remove-location');
                btn.disabled = locations.length === 1;
            });

            documents.forEach((item, index) => {
                const btn = item.querySelector('.remove-document');
                btn.disabled = documents.length === 1;
            });

            budgets.forEach((item, index) => {
                const btn = item.querySelector('.remove-budget');
                btn.disabled = budgets.length === 1;
            });

            milestones.forEach((item, index) => {
                const btn = item.querySelector('.remove-milestone');
                btn.disabled = milestones.length === 1;
            });
        }
    </script>
</body>
</html>