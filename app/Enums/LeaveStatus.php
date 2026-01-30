<?php

declare(strict_types=1);

namespace App\Enums;

enum LeaveStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case HeadApproved = 'head_approved';
    case HRApproved = 'hr_approved';
    case Rejected = 'rejected';
}
