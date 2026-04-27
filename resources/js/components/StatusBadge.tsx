import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  PauseCircle,
  Activity,
  XCircle
} from 'lucide-react'

type Props = { status: string }

export default function StatusBadge({ status }: Props) {
  const config: Record<string, { cls: string, icon: React.ReactNode }> = {
    active: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <Activity className="w-3 h-3 mr-1" /> },
    on_track: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },

    pending: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-3 h-3 mr-1" /> },
    risk: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertCircle className="w-3 h-3 mr-1" /> },

    draft: { cls: 'bg-gray-100 text-gray-800 border-gray-200', icon: <FileText className="w-3 h-3 mr-1" /> },
    proposal: { cls: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: <FileText className="w-3 h-3 mr-1" /> },

    finished: { cls: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    completed: { cls: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    closed: { cls: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },

    blocked: { cls: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3 mr-1" /> },

    on_hold: { cls: 'bg-orange-100 text-orange-800 border-orange-200', icon: <PauseCircle className="w-3 h-3 mr-1" /> },
    delayed: { cls: 'bg-orange-100 text-orange-800 border-orange-200', icon: <AlertCircle className="w-3 h-3 mr-1" /> },

    // Presence Statuses
    approved: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    rejected: { cls: 'bg-rose-100 text-rose-800 border-rose-200', icon: <XCircle className="w-3 h-3 mr-1" /> },

    // Leave Statuses
    submitted: { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-3 h-3 mr-1" /> },
    head_approved: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    hr_approved: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },

    // Presence Detail Statuses
    checked_in: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    late: { cls: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3 h-3 mr-1" /> },
  }

  const statusLabels: Record<string, string> = {
    active: 'Aktif',
    on_track: 'Sesuai Rencana',
    pending: 'Menunggu',
    risk: 'Beresiko',
    draft: 'Draft',
    proposal: 'Proposal',
    finished: 'Selesai',
    completed: 'Selesai',
    blocked: 'Terblokir',
    on_hold: 'Ditangguhkan',
    delayed: 'Terlambat',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    submitted: 'Diajukan',
    head_approved: 'Disetujui Head',
    hr_approved: 'Disetujui HR',
    finance_approved: 'Disetujui Finance',
    transferred: 'Sudah Ditransfer',
    closed: 'Ditutup',
    checked_in: 'Hadir',
    late: 'Terlambat',
  };

  const { cls, icon } = config[status] || { cls: 'bg-gray-100 text-gray-800', icon: null }
  const label = statusLabels[status] || status.replace('_', ' ');

  return (
    <Badge variant="outline" className={`font-normal capitalize ${cls}`}>
      {icon}
      {label}
    </Badge>
  )
}
