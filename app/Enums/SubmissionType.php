<?php

declare(strict_types=1);

namespace App\Enums;

enum SubmissionType: string
{
    case Initial = 'initial';
    case Monthly = 'monthly';
    case Completion = 'completion';
}
