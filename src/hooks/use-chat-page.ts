import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import spaceStore from '@/stores/space';

export const useChatPageCondition = () => {
    const { pathname } = useLocation();
    const { currentSelectedSpace } = useSnapshot(spaceStore);
    const { spaceID } = useParams();

    const isChat = useMemo(() => {
        let space = spaceID;

        if (!space) {
            space = currentSelectedSpace;
        }

        return pathname === `/dashboard/${space}/chat` || pathname.startsWith(`/dashboard/${space}/chat/session/`);
    }, [pathname]);

    const isSession = useMemo(() => {
        let space = spaceID;

        if (!space) {
            space = currentSelectedSpace;
        }

        return isChat && pathname !== `/dashboard/${space}/chat`;
    }, [pathname]);

    return { isChat, isSession };
};
