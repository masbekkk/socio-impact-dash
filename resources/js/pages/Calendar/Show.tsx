import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Users
} from 'lucide-react';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Types
type EventType = 'meeting' | 'deadline' | 'task' | 'holiday' | 'project';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    type: EventType;
    location: string | null;
    description: string | null;
    organizer: string | null;
    participants: string[];
    status: string;
}

// In real app, this would come from props based on selected date
// For now, we'll use the current date and filter events
const mockDate = new Date(); // This would be parsed from route params
const selectedDateString = format(mockDate, 'yyyy-MM-dd');

// Load events from JSON and filter by selected date
const allEvents: CalendarEvent[] = calendarEventsData as CalendarEvent[];
const mockEvents = allEvents.filter(event => event.date === selectedDateString);

const EVENT_TYPE_CONFIG = {
    meeting: {
        color: 'bg-blue-500 border-blue-600',
        textColor: 'text-white'
    },
    deadline: {
        color: 'bg-red-500 border-red-600',
        textColor: 'text-white'
    },
    task: {
        color: 'bg-slate-500 border-slate-600',
        textColor: 'text-white'
    },
    holiday: {
        color: 'bg-orange-500 border-orange-600',
        textColor: 'text-white'
    },
    project: {
        color: 'bg-emerald-600 border-emerald-700',
        textColor: 'text-white'
    }
};

export default function CalendarShow() {
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: selectedDateString,
        start_time: '09:00',
        end_time: '10:00',
        type: 'meeting' as EventType,
        location: '',
        description: '',
        organizer: '',
        participants: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kalender', href: '/calendar' },
        { title: format(mockDate, 'dd MMMM yyyy', { locale: id }), href: '#' },
    ];

    // Generate hours (0-23)
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Get events for a specific hour
    const getEventsForHour = (hour: number) => {
        return mockEvents.filter(event => {
            const startHour = parseInt(event.start_time.split(':')[0]);
            const endHour = parseInt(event.end_time.split(':')[0]);
            return hour >= startHour && hour < endHour;
        });
    };

    // Calculate event position and height
    const getEventStyle = (event: CalendarEvent) => {
        const [startHour, startMinute] = event.start_time.split(':').map(Number);
        const [endHour, endMinute] = event.end_time.split(':').map(Number);

        const startPosition = (startMinute / 60) * 100; // percentage within the hour
        const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60; // in hours
        const height = duration * 100; // percentage (100% = 1 hour)

        return {
            top: `${startPosition}%`,
            height: `${height}%`
        };
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, this would submit to backend
        console.log('Form data:', formData);
        // Reset form and close dialog
        setFormData({
            title: '',
            date: selectedDateString,
            start_time: '09:00',
            end_time: '10:00',
            type: 'meeting',
            location: '',
            description: '',
            organizer: '',
            participants: '',
        });
        setIsAddEventOpen(false);
        // Show success message
        alert('Agenda berhasil ditambahkan!');
    };

    const prevDay = () => {
        // Navigate to previous day
    };

    const nextDay = () => {
        // Navigate to next day
    };

    const goToToday = () => {
        // Navigate to today
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Agenda - ${format(mockDate, 'dd MMMM yyyy', { locale: id })}`} />

            <div className="flex flex-col min-h-[calc(100vh-6rem)] p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href="/calendar">
                            <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9 shrink-0">
                                <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 capitalize truncate">
                                {format(mockDate, 'EEEE', { locale: id })}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                                {format(mockDate, 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto sm:self-end">
                        <div className="flex items-center rounded-md border shadow-sm bg-white flex-1 sm:flex-initial">
                            <Button variant="ghost" size="icon" onClick={prevDay} className="rounded-r-none border-r h-8 w-8 md:h-9 md:w-9 shrink-0">
                                <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                            <Button variant="ghost" onClick={goToToday} className="rounded-none px-3 md:px-4 font-medium text-xs md:text-sm h-8 md:h-9 hover:bg-gray-50 flex-1 sm:flex-initial">
                                Hari Ini
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextDay} className="rounded-l-none border-l h-8 w-8 md:h-9 md:w-9 shrink-0">
                                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={() => setIsAddEventOpen(true)}
                            className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm gap-1.5 md:gap-2 h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm"
                        >
                            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden xs:inline">Tambah</span>
                            <span className="hidden sm:inline">Agenda</span>
                        </Button>
                    </div>
                </div>

                {/* Timeline View */}
                <Card className="flex-1 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                            {/* Time Labels */}
                            <div className="w-14 md:w-20 flex-shrink-0 border-r bg-gray-50/50">
                                <div className="h-10 md:h-12 border-b" /> {/* Header spacer */}
                                {hours.map((hour) => (
                                    <div key={hour} className="h-16 md:h-24 border-b flex items-start justify-end pr-2 md:pr-3 pt-1">
                                        <span className="text-[10px] md:text-xs font-medium text-gray-500">
                                            {hour.toString().padStart(2, '0')}:00
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Events Timeline */}
                            <div className="flex-1 relative overflow-x-hidden">
                                {/* Header */}
                                <div className="h-10 md:h-12 border-b bg-gray-50/50 flex items-center justify-center sticky top-0 z-10">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <CalendarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
                                        <span className="text-xs md:text-sm font-semibold text-gray-700">
                                            {mockEvents.length} Agenda
                                        </span>
                                    </div>
                                </div>

                                {/* Hour Slots */}
                                <div className="relative">
                                    {hours.map((hour) => (
                                        <div
                                            key={hour}
                                            className="h-16 md:h-24 border-b hover:bg-gray-50/50 transition-colors relative"
                                        >
                                            {/* Events for this hour */}
                                            {getEventsForHour(hour).map((event) => {
                                                const eventConfig = EVENT_TYPE_CONFIG[event.type];
                                                const style = getEventStyle(event);
                                                const isFirstHour = parseInt(event.start_time.split(':')[0]) === hour;

                                                return isFirstHour ? (
                                                    <Link
                                                        key={event.id}
                                                        href={`/calendar/event/${event.id}`}
                                                        className="absolute left-0.5 right-0.5 md:left-1 md:right-1 z-10"
                                                        style={{
                                                            top: style.top,
                                                            height: style.height,
                                                            minHeight: '48px'
                                                        }}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-md md:rounded-lg border-l-2 md:border-l-4 p-1.5 md:p-2 shadow-sm hover:shadow-md transition-all cursor-pointer",
                                                                eventConfig.color,
                                                                eventConfig.textColor
                                                            )}
                                                        >
                                                            <div className="flex items-start justify-between gap-1 md:gap-2 h-full">
                                                                <div className="flex-1 min-w-0 flex flex-col">
                                                                    <div className="flex items-center gap-1 md:gap-1.5 mb-0.5 md:mb-1">
                                                                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 opacity-90 shrink-0" />
                                                                        <span className="text-[10px] md:text-xs font-medium opacity-90 truncate">
                                                                            {event.start_time} - {event.end_time}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1 line-clamp-2">
                                                                        {event.title}
                                                                    </h4>
                                                                    {event.location && (
                                                                        <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs opacity-90 mb-0.5">
                                                                            <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
                                                                            <span className="truncate">{event.location}</span>
                                                                        </div>
                                                                    )}
                                                                    {event.description && (
                                                                        <p className="text-[10px] md:text-xs opacity-80 mt-auto line-clamp-1 md:line-clamp-2 hidden md:block">
                                                                            {event.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-5 w-5 md:h-6 md:w-6 shrink-0 hover:bg-white/20"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }}
                                                                >
                                                                    <MoreHorizontal className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ) : null;
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground">
                    <div>
                        Total {mockEvents.length} agenda pada hari ini
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-blue-500" />
                            <span>Meeting</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-slate-500" />
                            <span>Task</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Dialog */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-bold">Tambah Agenda</DialogTitle>
                        <DialogDescription>
                            {format(mockDate, 'EEEE, dd MMMM yyyy', { locale: id })}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title - MAIN FIELD */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold">
                                Nama Acara <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Contoh: Meeting Tim, Presentasi Client, Deadline Report"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                required
                                className="w-full text-base"
                                autoFocus
                            />
                        </div>

                        {/* Time - MAIN FIELD */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="start_time" className="text-sm font-semibold">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                                    required
                                    className="w-full text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_time" className="text-sm font-semibold">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                                    required
                                    className="w-full text-base"
                                />
                            </div>
                        </div>

                        {/* Type - SIMPLIFIED */}
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium">
                                Tipe
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleInputChange('type', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="meeting">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded bg-blue-500" />
                                            <span>Meeting</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="task">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded bg-slate-500" />
                                            <span>Task</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="deadline">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded bg-red-500" />
                                            <span>Deadline</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="project">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded bg-emerald-600" />
                                            <span>Project</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location - OPTIONAL */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                Lokasi <span className="text-xs text-muted-foreground">(opsional)</span>
                            </Label>
                            <Input
                                id="location"
                                placeholder="Ruang Meeting, Zoom, dll"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Description - OPTIONAL */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Catatan <span className="text-xs text-muted-foreground">(opsional)</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Tambahkan catatan atau deskripsi singkat"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                className="w-full resize-none"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddEventOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90 text-white w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
