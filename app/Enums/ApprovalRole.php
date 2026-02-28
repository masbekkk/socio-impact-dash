<?php

declare(strict_types=1);

namespace App\Enums;

enum ApprovalRole: string
{
    case Head = 'head';
    case Finance = 'finance';
    case Direktur = 'direktur';
    case HR = 'hr';
    case SuperAdmin = 'superadmin';
}
