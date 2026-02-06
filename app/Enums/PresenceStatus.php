<?php

declare(strict_types=1);

namespace App\Enums;

enum PresenceStatus: string
{
    case CheckedIn = 'checked_in';
    case Late = 'late';
    case Absent = 'absent';
    case Sick = 'sick';
    case Permission = 'permission';
    case AnnualLeave = 'annual_leave';
    case FieldDuty = 'field_duty';
    case WorkFromHome = 'wfh';
}
