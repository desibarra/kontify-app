import { useState, useEffect, useCallback } from 'react';
import { expertApplicationService, ExpertStatus } from '../services/expertApplicationService';

/**
 * Hook for real-time messaging polling
 * Polls every 10 seconds and simulates incoming messages based on expert status
 */
export interface UseRealTimeMessages {
    unreadCount: number;
    hasNewMessages: boolean;
    leadsWithNewMessages: string[];
    isPolling: boolean;
    lastCheck: string | null;
    refreshNow: () => Promise<void>;
}

export function useRealTimeMessages(): UseRealTimeMessages {
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const [leadsWithNewMessages, setLeadsWithNewMessages] = useState<string[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const [lastCheck, setLastCheck] = useState<string | null>(null);

    /**
     * Check for updates and simulate incoming messages
     */
    const checkForUpdates = useCallback(async () => {
        if (isPolling) return; // Prevent concurrent polls

        setIsPolling(true);

        try {
            // 1. Get expert status
            const status = await expertApplicationService.getStatus();

            // 2. Simulate incoming messages based on status
            if (status === 'online' || status === 'busy') {
                await expertApplicationService.simulateIncomingMessages(status);
            }

            // 3. Get unread count
            const count = await expertApplicationService.getUnreadMessageCount();
            setUnreadCount(count);
            setHasNewMessages(count > 0);

            // 4. Get leads with new messages
            const leadsWithNew = await expertApplicationService.getLeadsWithNewMessages();
            setLeadsWithNewMessages(leadsWithNew);

            // 5. Update last check timestamp
            const lastCheckTime = await expertApplicationService.getLastMessageCheck();
            setLastCheck(lastCheckTime);

        } catch (error) {
            console.error('Error checking for updates:', error);
        } finally {
            setIsPolling(false);
        }
    }, [isPolling]);

    /**
     * Manual refresh
     */
    const refreshNow = useCallback(async () => {
        await checkForUpdates();
    }, [checkForUpdates]);

    /**
     * Setup polling on mount
     */
    useEffect(() => {
        // Initial check
        checkForUpdates();

        // Poll every 10 seconds
        const interval = setInterval(() => {
            checkForUpdates();
        }, 10000); // 10 seconds

        // Cleanup on unmount
        return () => {
            clearInterval(interval);
        };
    }, [checkForUpdates]);

    return {
        unreadCount,
        hasNewMessages,
        leadsWithNewMessages,
        isPolling,
        lastCheck,
        refreshNow,
    };
}
