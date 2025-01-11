import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import userStore from '@/stores/user';
import { Role } from '@/types';

export function usePlan(): { userIsPro: boolean; isPlatform: boolean } {
    const { userInfo } = useSnapshot(userStore);

    const userIsPro = useMemo(() => {
        return userInfo && userInfo.planID;
    }, [userInfo]);

    const isPlatform = useMemo(() => {
        return userInfo && userInfo.serviceMode == 'saas';
    }, [userInfo]);

    return { userIsPro, isPlatform };
}
