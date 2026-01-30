<?php

declare(strict_types=1);

namespace App\Enums;

enum EmployeeType: string
{
    case Kontrak = 'kontrak';
    case Intern = 'intern';
    case PegawaiTetap = 'pegawai_tetap';
}
