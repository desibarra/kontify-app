import { useState, useEffect } from 'react';
import { expertApplicationService, ExpertStatus, ExpertNotification } from '../services/expertApplicationService';

interface UseExpertStatusReturn {
    status: ExpertStatus;
    setStatus: (status: ExpertStatus) => Promise<void>;
    notifications: ExpertNotification[];
    unreadCount: number;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

export function useExpertStatus(): UseExpertStatusReturn {
    const [status, setStatusState] = useState<ExpertStatus>('offline');
    const [notifications, setNotifications] = useState<ExpertNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadData = async () => {
        const currentStatus = await expertApplicationService.getStatus();
        const notifs = await expertApplicationService.getNotifications();
        const unread = notifs.filter(n => !n.isRead).length;

        setStatusState(currentStatus);
        setNotifications(notifs);
        setUnreadCount(unread);
    };

    useEffect(() => {
        loadData();
    }, []);

    const setStatus = async (newStatus: ExpertStatus) => {
        await expertApplicationService.setStatus(newStatus);
        setStatusState(newStatus);
    };

    const markAsRead = async (notificationId: string) => {
        const notifs = await expertApplicationService.getNotifications();
        const updated = notifs.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        );
        // Update manually since markNotificationAsRead doesn't exist
        await refreshNotifications();
    };

    const markAllAsRead = async () => {
        await expertApplicationService.markAllNotificationsAsRead();
        await refreshNotifications();
    };

    const refreshNotifications = async () => {
        const notifs = await expertApplicationService.getNotifications();
        const unread = notifs.filter(n => !n.isRead).length;
        setNotifications(notifs);
        setUnreadCount(unread);
    };

    return {
        status,
        setStatus,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
    };
}
