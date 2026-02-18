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
    case RAB = 'RAB';
    case TransferProof = 'transfer_proof';
    case SOW = 'SOW';
    case TOR = 'TOR';
    case ReportActivity = 'report_activity';
    case LessonLearn = 'lesson_learn';
    case BAST = 'bast';
    case Invoice = 'invoice';
    case Other = 'other';
}
