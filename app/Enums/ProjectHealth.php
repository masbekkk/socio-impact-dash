<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectHealth: string
{
    case Sehat = 'sehat';
    case Waspada = 'waspada';
    case Kritis = 'kritis';
    case SangatKritis = 'sangat_kritis';
}
