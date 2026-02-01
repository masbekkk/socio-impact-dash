<?php

declare(strict_types=1);

namespace App\Enums;

enum ReminderType: string
{
    case MonitoringReminder = 'monitoring_reminder';
    case EarlyWarning = 'early_warning';
    case Milestone = 'milestone';
    case Other = 'other';
}
