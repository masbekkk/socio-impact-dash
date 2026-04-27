<?php

declare(strict_types=1);

namespace App\Enums;

enum ReimbursementStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Revised = 'revised';
    case Approved = 'approved';
    case HeadApproved = 'head_approved';
    case HRApproved = 'hr_approved';
    case FinanceApproved = 'finance_approved';
    case Requested = 'request_fund';
    case Transferred = 'transferred';
    case Rejected = 'rejected';
    case Revision = 'revision';
    case Closed = 'closed';
}
