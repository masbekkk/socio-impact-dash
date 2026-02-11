import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

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
                        <div className="relative">
                            <Input
                                ref={startRef}
                                type="date"
                                className="h-8 text-xs pr-12 [&::-webkit-calendar-picker-indicator]:hidden"
                                value={startDate}
                                onChange={(e) => onSelect(e.target.value, endDate)}
                            />
                            <CalendarIcon
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground md:block"
                                onClick={() => startRef.current?.showPicker()}
                            />
                        </div>
                    </div>
                    <div className="space-y-1 relative">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Sampai</Label>
                        <div className="relative">
                            <Input
                                ref={endRef}
                                type="date"
                                className="h-8 text-xs pr-12 [&::-webkit-calendar-picker-indicator]:hidden"
                                value={endDate}
                                onChange={(e) => onSelect(startDate, e.target.value)}
                            />
                            <CalendarIcon
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground md:block"
                                onClick={() => endRef.current?.showPicker()}
                            />
                        </div>
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
