<?php

declare(strict_types=1);

namespace App\Enums;

enum ExpenseType: string
{
    case Travel = 'TRAVEL';
    case OperationalExpenses = 'OPERATIONAL EXPENSES';
    case EquipmentItemAsset = 'EQUIPMENT ITEM ASSET';
    case EquipmentItemNonAsset = 'EQUIPMENT ITEM NON ASSET';
    case Charity = 'CHARITY';
    case Entertainment = 'ENTERTAINMENT';
}
