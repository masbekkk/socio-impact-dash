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

    public function label(): string
    {
        return match ($this) {
            self::Annual => 'Cuti Tahunan',
            self::Sick => 'Sakit',
            self::Unpaid => 'Cuti di Luar Tanggungan',
            self::Travel => 'Perjalanan Dinas',
            self::Berduka => 'Berduka',
            self::Wedding => 'Menikah',
            self::Birth => 'Melahirkan',
            self::Important => 'Urusan Penting',
        };
    }
}
