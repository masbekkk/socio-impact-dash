<?php

declare(strict_types=1);

return [
    'check_in_time' => env('PRESENCE_CHECK_IN_TIME', '09:00'),
    'tolerance_minutes' => (int) env('PRESENCE_TOLERANCE_MINUTES', 15),
];
