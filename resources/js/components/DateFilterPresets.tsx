import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/DatePicker';
import {
    format,
    startOfMonth,
    endOfMonth,
    subDays,
    subMonths,
} from 'date-fns';

interface DateFilterPresetsProps {
    startDate: string;
    endDate: string;
    onSelect: (start: string, end: string) => void;
}

export const DateFilterPresets = ({ startDate, endDate, onSelect }: DateFilterPresetsProps) => {

    const applyPreset = (type: 'today' | 'yesterday' | 'thisMonth' | 'last3Months') => {
        const today = new Date();
        let start = today;
        let end = today;

        switch (type) {
            case 'today': break;
            case 'yesterday': start = subDays(today, 1); end = subDays(today, 1); break;
            case 'thisMonth': start = startOfMonth(today); end = endOfMonth(today); break;
            case 'last3Months': start = subMonths(today, 3); end = today; break;
        }
        onSelect(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
    };

    return (
        <div className="w-auto min-w-[340px] bg-white">
            <div className="p-2 grid grid-cols-2 gap-2 border-b bg-muted/20">
                <Button variant="outline" size="sm" onClick={() => applyPreset('today')} className="text-xs h-8">Hari Ini</Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('yesterday')} className="text-xs h-8">Kemarin</Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('thisMonth')} className="text-xs h-8">Bulan Ini</Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('last3Months')} className="text-xs h-8">3 Bulan Terakhir</Button>
            </div>

            <div className="p-3 border-b space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 relative">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Dari</Label>
                        <DatePicker
                            value={startDate}
                            onChange={(v) => onSelect(v, endDate)}
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1 relative">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Sampai</Label>
                        <DatePicker
                            value={endDate}
                            onChange={(v) => onSelect(startDate, v)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </div>
            <div className="p-2 border-t bg-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground font-medium">
                    {startDate && endDate ? `${format(new Date(startDate), 'dd MMM')} - ${format(new Date(endDate), 'dd MMM')}` : 'Pilih tanggal'}
                </span>
                {(startDate || endDate) && (
                    <Button variant="ghost" size="sm" onClick={() => onSelect('', '')} className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">Reset</Button>
                )}
            </div>
        </div>
    );
};
