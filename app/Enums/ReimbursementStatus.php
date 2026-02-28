<?php

declare(strict_types=1);

namespace App\Enums;

enum ReimbursementStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case HeadApproved = 'head_approved';
    case FinanceApproved = 'finance_approved';
    case Transferred = 'transferred';
    case Rejected = 'rejected';
    case Revision = 'revision';
}
