<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Pegawai = 'pegawai';
    case Head = 'head';
    case Director = 'director';
    case Finance = 'finance';
    case HR = 'hr';
    case OfficeCoordinator = 'office_coordinator';
    case Superadmin = 'superadmin';
}
