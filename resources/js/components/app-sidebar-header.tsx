import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useNotifications } from '@/hooks/use-notifications';
import { Bell, CheckCheck, Loader2, Folder, DollarSign } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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
        if (type.startsWith('reimbursement')) return <DollarSign className="h-4 w-4 text-green-500 shrink-0" />;
        return <Bell className="h-4 w-4 text-gray-400 shrink-0" />;
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
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
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
                        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
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
                                        onClick={() => {
                                            if (!n.read_at) markAsRead(n.id);
                                        }}
                                        className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-slate-50 transition-colors ${!n.read_at ? 'bg-blue-50/40' : ''}`}
                                    >
                                        <div className="mt-0.5">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-snug ${!n.read_at ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {formatDistanceToNow(new Date(n.created_at), {
                                                    addSuffix: true,
                                                    locale: localeId,
                                                })}
                                            </p>
                                        </div>
                                        {!n.read_at && (
                                            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                        )}
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

