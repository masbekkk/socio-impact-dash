import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import {
    addMonths,
    eachDayOfInterval,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    isWithinInterval,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { id } from 'date-fns/locale';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react';
import React, { useState } from 'react';

type EventType = 'project' | 'leave' | 'monitoring' | 'event';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    endDate: string | null;
    type: EventType;
    description?: string;
    allDay?: boolean;
    route?: string;
}

interface ProjectData {
    id: number;
    name: string;
}

interface PageProps {
    events: CalendarEvent[];
    projects: ProjectData[];
}

const EVENT_STYLES: Record<EventType, string> = {
    project:
        'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm', // Info logic essentially
    leave: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200', // Destructive
    monitoring: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200', // Primary/Secondary
    event: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200', // Muted
};

const EVENT_LABELS: Record<EventType, string> = {
    project: 'Project',
    leave: 'Cuti',
    monitoring: 'Monitoring',
    event: 'Agenda',
};

export default function CalendarIndex({
    events = [],
    projects = [],
}: PageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kalender', href: '/calendar' },
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filters
    const [visibleTypes, setVisibleTypes] = useState<
        Record<EventType, boolean>
    >({
        project: true,
        leave: true,
        monitoring: true,
        event: true,
    });

    const toggleFilter = (type: EventType) => {
        setVisibleTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    // Form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: '',
        project_id: '',
        notes: '',
    });

    const handleOpenDialog = (date: Date = new Date()) => {
        setSelectedDate(date);
        setData('start_date', format(date, 'yyyy-MM-dd'));
        setData('end_date', '');
        setIsDialogOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('calendar.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

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
        return events
            .filter((event) => visibleTypes[event.type])
            .filter((event) => {
                const eventStartDate = startOfDay(parseISO(event.date));
                if (event.endDate) {
                    const eventEndDate = endOfDay(parseISO(event.endDate));
                    return isWithinInterval(day, {
                        start: eventStartDate,
                        end: eventEndDate,
                    });
                }
                return isSameDay(eventStartDate, day);
            });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalender" />

            <div className="flex h-full min-h-[calc(100vh-6rem)] flex-col space-y-6 p-6 md:p-8">
                {/* Header Toolbar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-4 sm:w-auto">
                        <div className="flex items-center rounded-md border bg-white shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevMonth}
                                className="h-9 w-9 rounded-r-none border-r"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={goToToday}
                                className="h-9 rounded-none px-4 text-sm font-medium hover:bg-gray-50"
                            >
                                Hari Ini
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextMonth}
                                className="h-9 w-9 rounded-l-none border-l"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800 capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: id })}
                        </h2>
                    </div>

                    <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
                        {/* Filters */}
                        <div className="flex shrink-0 rounded-md border bg-white p-1 shadow-sm">
                            {Object.entries(EVENT_LABELS).map(
                                ([type, label]) => (
                                    <Button
                                        key={type}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            toggleFilter(type as EventType)
                                        }
                                        className={cn(
                                            'h-7 rounded px-2 text-xs',
                                            visibleTypes[type as EventType]
                                                ? 'bg-gray-100 font-medium text-gray-900'
                                                : 'opacity-50 hover:opacity-100',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'mr-1.5 h-2 w-2 rounded-full',
                                                type === 'project'
                                                    ? 'bg-emerald-500'
                                                    : type === 'leave'
                                                      ? 'bg-red-500'
                                                      : type === 'monitoring'
                                                        ? 'bg-blue-500'
                                                        : 'bg-slate-500',
                                            )}
                                        />
                                        {label}
                                    </Button>
                                ),
                            )}
                        </div>

                        <Button
                            onClick={() => handleOpenDialog()}
                            className="shrink-0 gap-2 bg-[var(--sidebar)] text-white shadow-sm transition-all hover:scale-105 hover:bg-[var(--sidebar)] active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Agenda Baru
                        </Button>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[500px]">
                                <form onSubmit={submitForm}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Buat Agenda Baru
                                        </DialogTitle>
                                        <DialogDescription>
                                            Tambahkan jadwal kegiatan, meeting,
                                            atau milestone untuk tanggal{' '}
                                            {selectedDate
                                                ? format(
                                                      selectedDate,
                                                      'dd MMMM yyyy',
                                                      { locale: id },
                                                  )
                                                : 'ini'}
                                            .
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Judul Kegiatan{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Contoh: Meeting Proyek Alpha"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.name && (
                                                <span className="text-xs text-red-500">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="project_id">
                                                Pilih Project (Opsional)
                                            </Label>
                                            <Select
                                                value={data.project_id}
                                                onValueChange={(val) =>
                                                    setData('project_id', val)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">
                                                        -- Tidak ada Project
                                                        (Umum) --
                                                    </SelectItem>
                                                    {projects.map((proj) => (
                                                        <SelectItem
                                                            key={proj.id}
                                                            value={proj.id.toString()}
                                                        >
                                                            {proj.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.project_id && (
                                                <span className="text-xs text-red-500">
                                                    {errors.project_id}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="start_date">
                                                    Tanggal Mulai{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="start_date"
                                                        type="date"
                                                        className="pl-9"
                                                        value={data.start_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                'start_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.start_date && (
                                                    <span className="text-xs text-red-500">
                                                        {errors.start_date}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="end_date">
                                                    Tanggal Selesai (Opsional)
                                                </Label>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="end_date"
                                                        type="date"
                                                        className="pl-9"
                                                        value={data.end_date}
                                                        onChange={(e) =>
                                                            setData(
                                                                'end_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.end_date && (
                                                    <span className="text-xs text-red-500">
                                                        {errors.end_date}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="notes">
                                                Catatan Tambahan / Deskripsi
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Tambahkan catatan atau detail kegiatan..."
                                                className="resize-none"
                                                rows={3}
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        'notes',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.notes && (
                                                <span className="text-xs text-red-500">
                                                    {errors.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsDialogOpen(false)
                                            }
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Agenda'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Calendar Card Wrapper */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b bg-gray-50/50">
                        {weekDays.map((day, idx) => (
                            <div
                                key={day}
                                className="border-r py-2 text-center text-[10px] font-semibold tracking-wider text-gray-500 uppercase last:border-r-0 md:py-3 md:text-sm"
                            >
                                <span className="hidden md:inline">{day}</span>
                                <span className="md:hidden">
                                    {day.charAt(0)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid flex-1 auto-rows-fr grid-cols-7 divide-x divide-y md:grid-rows-5">
                        {calendarDays.map((day, dayIdx) => {
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = isSameMonth(
                                day,
                                currentDate,
                            );
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        'group relative flex min-h-[80px] flex-col gap-0.5 bg-white p-1 transition-all hover:bg-gray-50 md:min-h-[120px] md:gap-1 md:p-2',
                                        !isCurrentMonth &&
                                            'bg-gray-50/30 text-gray-400',
                                    )}
                                >
                                    <div className="mb-0.5 flex items-center justify-between md:mb-1">
                                        <div
                                            className={cn(
                                                'flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors md:h-7 md:w-7 md:text-sm',
                                                isTodayDate
                                                    ? 'bg-[var(--sidebar)] text-white shadow-sm'
                                                    : 'text-gray-700',
                                                !isCurrentMonth &&
                                                    'text-gray-400',
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </div>
                                        {dayEvents.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="h-4 px-1 text-[9px] md:h-5 md:px-1.5 md:text-[10px]"
                                            >
                                                {dayEvents.length}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Event List */}
                                    <div className="flex flex-col gap-0.5 overflow-hidden md:gap-1.5">
                                        {dayEvents.slice(0, 4).map((event) => {
                                            const Inner = () => (
                                                <>
                                                    <div
                                                        className={cn(
                                                            'h-1 w-1 shrink-0 rounded-full md:h-1.5 md:w-1.5',
                                                            event.type ===
                                                                'project'
                                                                ? 'bg-white'
                                                                : event.type ===
                                                                    'leave'
                                                                  ? 'bg-red-500'
                                                                  : event.type ===
                                                                      'monitoring'
                                                                    ? 'bg-blue-500'
                                                                    : 'bg-slate-500',
                                                        )}
                                                    />
                                                    <span className="flex-1 truncate">
                                                        {event.title}
                                                    </span>
                                                </>
                                            );

                                            const className = cn(
                                                'flex items-center gap-1 truncate rounded-md border px-1 py-0.5 text-[9px] font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-md md:gap-1.5 md:px-2 md:py-1 md:text-[11px]',
                                                EVENT_STYLES[event.type],
                                            );

                                            // Make actionable via route if it exists
                                            if (event.route) {
                                                return (
                                                    <a
                                                        key={event.id}
                                                        href={event.route}
                                                        title={
                                                            event.description ||
                                                            event.title
                                                        }
                                                        className={className}
                                                    >
                                                        <Inner />
                                                    </a>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={event.id}
                                                    title={
                                                        event.description ||
                                                        event.title
                                                    }
                                                    className={className}
                                                >
                                                    <Inner />
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 4 && (
                                            <div className="px-1 text-[9px] font-medium text-gray-500 md:px-2 md:text-[10px]">
                                                +{dayEvents.length - 4} lagi
                                            </div>
                                        )}
                                    </div>

                                    {/* Add button on hover (desktop) */}
                                    <div className="absolute right-1 bottom-1 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-5 w-5 rounded-full border bg-white shadow-sm hover:bg-gray-200 md:h-[22px] md:w-[22px]"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleOpenDialog(day);
                                            }}
                                        >
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
