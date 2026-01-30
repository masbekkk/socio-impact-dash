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
}
