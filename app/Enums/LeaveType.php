<?php

declare(strict_types=1);

namespace App\Enums;

enum LeaveType: string
{
    case Annual = 'annual';
    case Sick = 'sick';
    case Unpaid = 'unpaid';
    case Travel = 'travel';
    case Berduka = 'berduka'; 
    case Wedding = 'wedding';
    case Birth = 'birth';
    case Important = 'important';
}
