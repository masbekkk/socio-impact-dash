import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface NotificationItem {
    id: number;
    notification_id: number;
    type: string;
    title: string;
    message: string;
    reference_type: string | null;
    reference_id: number | null;
    priority: string;
    status: string;
    read_at: string | null;
    created_at: string;
    creator: {
        id: number;
        name: string;
    } | null;
}

interface UseNotificationsReturn {
    unreadCount: number;
    notifications: NotificationItem[];
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllRead: () => Promise<void>;
}

export function useNotifications(pollIntervalMs = 30000): UseNotificationsReturn {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/v1/notifications/unread-count');
            setUnreadCount(data?.data?.count ?? 0);
        } catch {
            // silently ignore polling errors
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/v1/notifications?per_page=20');
            setNotifications(data?.data?.data ?? []);
        } catch {
            // silently ignore
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: number) => {
        try {
            await axios.post(`/api/v1/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // silently ignore
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await axios.post('/api/v1/notifications/read-all');
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, status: 'read', read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch {
            // silently ignore
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();

        intervalRef.current = setInterval(fetchUnreadCount, pollIntervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchUnreadCount, pollIntervalMs]);

    return { unreadCount, notifications, loading, fetchNotifications, markAsRead, markAllRead };
}
