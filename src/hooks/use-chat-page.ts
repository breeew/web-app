import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useChatPageCondition = () => {
    const { pathname } = useLocation();

    const isChat = useMemo(() => {
        return pathname === '/dashboard/chat' || pathname.startsWith('/dashboard/chat/session/');
    }, [pathname]);

    const isSession = useMemo(() => {
        return isChat && pathname !== '/dashboard/chat';
    }, [pathname]);

    return { isChat, isSession };
};
