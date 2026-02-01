<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Active = 'active';
    case Finished = 'finished';
    case Archived = 'archived';
    // Monitoring status (for monthly/completion reporting)
    case NotStarted = 'not_started';
    case OnTrack = 'on_track';
    case AtRisk = 'at_risk';
    case Delayed = 'delayed';
    case Completed = 'completed';
}
