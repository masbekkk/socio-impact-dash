<?php

declare(strict_types=1);

namespace App\Enums;

enum DocumentType: string
{
    case Proposal = 'proposal';
    case Contract = 'contract';
    case MoM = 'mom';
    case Receipt = 'receipt';
    case EER = 'eer';
    case RAB = 'rab';
    case TransferProof = 'transfer_proof';
    case Other = 'other';
}
