<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\IssueSeverity;
use App\Enums\IssueStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProjectIssue extends Model
{
    use HasFactory;

    protected $table = 'project_issues';

    protected $fillable = ['project_id', 'title', 'description', 'severity', 'owner_id', 'status'];

    public function casts(): array
    {
        return ['id' => 'integer', 'project_id' => 'integer', 'owner_id' => 'integer', 'severity' => IssueSeverity::class, 'status' => IssueStatus::class];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
