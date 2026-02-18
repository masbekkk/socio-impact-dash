import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    MoreHorizontal
} from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addDays,
    subDays,
    setHours,
    setMinutes,
    isWithinInterval,
    startOfDay,
    endOfDay,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock Event Types
type EventType = 'meeting' | 'deadline' | 'holiday' | 'task' | 'project';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    endDate?: Date;
    type: EventType;
    description?: string;
    location?: string;
    allDay?: boolean;
}

const EVENT_STYLES: Record<EventType, string> = {
    meeting: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
    deadline: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    holiday: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
    task: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    project: 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm',
};

// Generate some mock events relative to today
const generateMockEvents = (): CalendarEvent[] => {
    const today = new Date();
    const monthStart = startOfMonth(today);

    return [
        {
            id: '1',
            title: 'Meeting Tim Proyek',
            date: setHours(setMinutes(today, 0), 10), // Hari ini jam 10:00
            type: 'meeting',
            description: 'Diskusi mingguan progress proyek Alpha.',
            location: 'Ruang Meeting 1'
        },
        {
            id: '2',
            title: 'Deadline Laporan Bulanan',
            date: setHours(setMinutes(addDays(today, 2), 0), 17), // 2 hari lagi jam 17:00
            type: 'deadline',
            description: 'Submit laporan ke manajemen.',
            allDay: false
        },
        {
            id: '3',
            title: 'Cuti Bersama',
            date: addDays(today, 5),
            type: 'holiday',
            allDay: true
        },
        {
            id: '4',
            title: 'Review Design UI',
            date: setHours(setMinutes(subDays(today, 3), 0), 14), // 3 hari lalu jam 14:00
            type: 'meeting',
            location: 'Google Meet'
        },
        {
            id: '5',
            title: 'Kickoff Project Beta',
            date: setHours(setMinutes(addDays(today, 10), 0), 9),
            type: 'task',
            location: 'Lobby Utama'
        },
        // Long Event Example (Project)
        {
            id: '6',
            title: 'Implementasi Dashboard V2',
            date: monthStart, // Start of this month
            endDate: addDays(monthStart, 14), // Until 14 days later (e.g. 1-15)
            type: 'project',
            allDay: true
        }
    ];
};

export default function CalendarIndex() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kalender', href: '/calendar' },
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Helpers
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Generate Calendar Grid
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Senin
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    // Get events for a specific day
    const getEventsForDay = (day: Date) => {
        return events.filter(event => {
            if (event.endDate) {
                return isWithinInterval(day, {
                    start: startOfDay(event.date),
                    end: endOfDay(event.endDate)
                });
            }
            return isSameDay(event.date, day);
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalender" />

            <div className="flex flex-col h-full min-h-[calc(100vh-6rem)] p-6 md:p-8 space-y-6">

                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center rounded-md border shadow-sm bg-white">
                            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-r-none border-r h-9 w-9">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" onClick={goToToday} className="rounded-none px-4 font-medium text-sm h-9 hover:bg-gray-50">
                                Hari Ini
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-l-none border-l h-9 w-9">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
                            {format(currentDate, 'MMMM yyyy', { locale: id })}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm gap-2 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                                    <Plus className="h-4 w-4" />
                                    Agenda Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Buat Agenda Baru</DialogTitle>
                                    <DialogDescription>
                                        Tambahkan jadwal kegiatan atau meeting baru untuk tanggal {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: id }) : 'ini'}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Judul Kegiatan</Label>
                                        <Input id="title" placeholder="Contoh: Meeting Proyek Alpha" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Tipe Agenda</Label>
                                        <Select defaultValue="meeting">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="meeting">📅  Meeting</SelectItem>
                                                <SelectItem value="deadline">🚨  Deadline</SelectItem>
                                                <SelectItem value="task">✅  Tugas</SelectItem>
                                                <SelectItem value="holiday">🎉  Libur</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Waktu Mulai</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="time" className="pl-9" defaultValue="09:00" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Waktu Selesai</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="time" className="pl-9" defaultValue="10:00" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Lokasi (Opsional)</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="location" placeholder="Ruang Meeting / Google Meet" className="pl-9" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Deskripsi</Label>
                                        <Textarea id="desc" placeholder="Tambahkan catatan atau detail kegiatan..." className="resize-none" rows={3} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                    <Button type="submit" className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]" onClick={() => setIsDialogOpen(false)}>Simpan Agenda</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Calendar Card Wrapper */}
                <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b bg-gray-50/50">
                        {weekDays.map((day, idx) => (
                            <div key={day} className="py-2 md:py-3 text-center text-[10px] md:text-sm font-semibold text-gray-500 uppercase tracking-wider border-r last:border-r-0">
                                <span className="hidden md:inline">{day}</span>
                                <span className="md:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 auto-rows-fr md:grid-rows-5 flex-1 divide-x divide-y">
                        {calendarDays.map((day, dayIdx) => {
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "min-h-[80px] md:min-h-[120px] p-1 md:p-2 transition-all hover:bg-gray-50 flex flex-col gap-0.5 md:gap-1 relative group bg-white",
                                        !isCurrentMonth && "bg-gray-50/30 text-gray-400"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-0.5 md:mb-1">
                                        <Link
                                            href={`/calendar/day/${format(day, 'yyyy-MM-dd')}`}
                                            className={cn(
                                                "text-xs md:text-sm font-medium w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-colors hover:bg-gray-200",
                                                isTodayDate
                                                    ? "bg-[var(--sidebar)] text-white shadow-sm hover:bg-[var(--sidebar)]/90"
                                                    : "text-gray-700",
                                                !isCurrentMonth && "text-gray-400"
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </Link>
                                        {dayEvents.length > 0 && (
                                            <Badge variant="secondary" className="h-4 md:h-5 text-[9px] md:text-[10px] px-1 md:px-1.5">
                                                {dayEvents.length}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Event List */}
                                    <div className="flex flex-col gap-0.5 md:gap-1.5 overflow-hidden">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/calendar/${event.id}`}
                                                className={cn(
                                                    "text-[9px] md:text-[11px] px-1 md:px-2 py-0.5 md:py-1 rounded-md border truncate font-medium flex items-center gap-1 md:gap-1.5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
                                                    EVENT_STYLES[event.type]
                                                )}
                                                title={event.title}
                                            >
                                                {!event.allDay && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full shrink-0 ${event.type === 'meeting' ? 'bg-blue-500' : event.type === 'deadline' ? 'bg-red-500' : 'bg-gray-500'}`} />}
                                                <span className="truncate flex-1">
                                                    <span className="hidden md:inline">{event.allDay ? '' : format(event.date, 'HH:mm')} </span>
                                                    {event.title}
                                                </span>
                                            </Link>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-[9px] md:text-[10px] text-gray-500 font-medium px-1 md:px-2">
                                                +{dayEvents.length - 2} lagi
                                            </div>
                                        )}
                                    </div>

                                    {/* Add button on hover (desktop) */}
                                    <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity md:block hidden">
                                        <Button size="icon" variant="ghost" className="h-5 w-5 md:h-6 md:w-6 rounded-full hover:bg-gray-200">
                                            <Plus className="h-3 w-3 text-gray-500" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
