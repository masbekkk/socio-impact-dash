<?php

declare(strict_types=1);

namespace App\Enums;

enum ReimbursementType: string
{
    case ATR = 'atr';
    case EER = 'eer';
}
