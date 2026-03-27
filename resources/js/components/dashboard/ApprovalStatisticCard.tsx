import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ApprovalStatisticCardProps {
    title: string;
    count: number;
    onClick: () => void;
    icon?: React.ReactNode;
    color?: 'emerald' | 'blue' | 'amber' | 'rose';
}

export function ApprovalStatisticCard({ title, count, onClick, icon, color = 'emerald' }: ApprovalStatisticCardProps) {
    const colorClasses = {
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100',
        blue: 'bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100',
        amber: 'bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100',
        rose: 'bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100',
    };

    const iconColorClasses = {
        emerald: 'bg-emerald-200 text-emerald-700',
        blue: 'bg-blue-200 text-blue-700',
        amber: 'bg-amber-200 text-amber-700',
        rose: 'bg-rose-200 text-rose-700',
    };

    return (
        <Card 
            className={cn(
                "cursor-pointer transition-all hover:shadow-md border", 
                colorClasses[color]
            )}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={cn("p-2 rounded-full", iconColorClasses[color])}>
                    {icon || <Clock className="h-4 w-4" />}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-xs font-medium opacity-70">Pengajuan</span>
                </div>
                {count > 0 ? (
                    <div className="mt-2 flex items-center text-xs font-medium">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Butuh persetujuan
                    </div>
                ) : (
                    <div className="mt-2 flex items-center text-xs font-medium opacity-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Semua selesai
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
