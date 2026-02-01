<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectType: string
{
    case Pendampingan = 'pendampingan';
    case Dokumen = 'dokumen';
    case Event = 'event';
    case Pelatihan = 'pelatihan';
}
