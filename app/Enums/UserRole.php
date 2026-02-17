<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Pegawai = 'pegawai';
    case Head = 'head';
    case Finance = 'finance';
    case Superadmin = 'superadmin';
    case Direktur = 'direktur';
}
