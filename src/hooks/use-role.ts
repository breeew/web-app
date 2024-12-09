import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import spaceStore from '@/stores/space';
import { Role } from '@/types';

export function useRole(): { isViewer: boolean } {
    const { spaceRole } = useSnapshot(spaceStore);

    const isSpaceViewer = useMemo(() => {
        return !spaceRole || spaceRole === Role.VIEWER;
    });

    return { isSpaceViewer };
}
