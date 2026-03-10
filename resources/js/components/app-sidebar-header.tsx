import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useNotifications } from '@/hooks/use-notifications';
import { Bell, CheckCheck, Loader2, Folder, DollarSign, CalendarDays, FileText, ExternalLink, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { router } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { unreadCount, notifications, loading, fetchNotifications, markAsRead, markAllRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (!open) {
            fetchNotifications();
        }
        setOpen((prev) => !prev);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handler);
        }
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const getIcon = (type: string) => {
        if (type.startsWith('project')) return <Folder className="h-4 w-4 text-blue-500 shrink-0" />;
        if (type.startsWith('reimbursement')) return <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />;
        if (type.startsWith('leave')) return <CalendarDays className="h-4 w-4 text-amber-500 shrink-0" />;
        if (type.startsWith('letter')) return <FileText className="h-4 w-4 text-purple-500 shrink-0" />;
        return <Bell className="h-4 w-4 text-gray-400 shrink-0" />;
    };

    const getActionBadge = (type: string) => {
        if (type.includes('approved') || type.includes('request_fund')) {
            return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 text-green-700">Disetujui</span>;
        }
        if (type.includes('rejected')) {
            return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 text-red-700">Ditolak</span>;
        }
        if (type.includes('revision')) {
            return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-700">Revisi</span>;
        }
        if (type.includes('created')) {
            return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-100 text-blue-700">Baru</span>;
        }
        if (type.includes('transferred')) {
            return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-100 text-indigo-700">Ditransfer</span>;
        }
        return null;
    };

    const getPriorityDot = (priority: string) => {
        if (priority === 'high' || priority === 'urgent') {
            return <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" title="Prioritas tinggi" />;
        }
        return null;
    };

    const handleNotificationClick = (n: typeof notifications[0]) => {
        if (!n.read_at) markAsRead(n.id);
        if (n.url) {
            setOpen(false);
            router.visit(n.url);
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-[var(--sidebar)] text-white md:bg-transparent md:text-foreground border-white/20 md:border-sidebar-border/50">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={panelRef}>
                <button
                    onClick={handleToggle}
                    className="relative p-2 rounded-lg hover:bg-white/10 md:hover:bg-muted transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 shadow-sm animate-in zoom-in-50">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-2 w-[420px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <p className="text-[10px] text-muted-foreground">{unreadCount} belum dibaca</p>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                                        <Bell className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors group ${!n.read_at ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                                            } ${n.url ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        {/* Icon */}
                                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${!n.read_at ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'bg-slate-100'
                                            }`}>
                                            {getIcon(n.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title + Badge row */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p className={`text-xs leading-snug ${!n.read_at ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                                    {n.title}
                                                </p>
                                                {getActionBadge(n.type)}
                                                {getPriorityDot(n.priority)}
                                            </div>

                                            {/* Message */}
                                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                                {n.message}
                                            </p>

                                            {/* Meta row: creator + time */}
                                            <div className="flex items-center gap-2 mt-1">
                                                {n.creator && (
                                                    <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                                                        <User className="h-2.5 w-2.5" />
                                                        {n.creator.name}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400">
                                                    {formatDistanceToNow(new Date(n.created_at), {
                                                        addSuffix: true,
                                                        locale: localeId,
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right side: unread dot + link indicator */}
                                        <div className="flex flex-col items-center gap-1.5 mt-0.5 shrink-0">
                                            {!n.read_at && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            )}
                                            {n.url && (
                                                <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

