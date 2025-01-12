import { proxy } from 'valtio';

import { ListUserSpace } from '@/apis/space';
import { UserSpace } from '@/apis/space';

const spaceStore = proxy<SpaceStore>({
    spaces: [],
    currentSelectedSpace: '',
    spaceRole: 'role-viewer'
});

export const setUserSpaces = (spaces: UserSpace[]) => {
    spaceStore.spaces = spaces;
};

export const latestPickedSpace = (): string | undefined => {
    return localStorage.getItem('brew-selected-space');
};

export const setCurrentSelectedSpace = (space: string) => {
    spaceStore.currentSelectedSpace = space;
    if (space) {
        localStorage.setItem('brew-selected-space', space);
        const spaceInfo = spaceStore.spaces.find(v => v.space_id == space);

        spaceInfo && setSpaceRole(spaceInfo?.role);
    }
};

export const setSpaceRole = (role: string) => {
    console.log('set role', role);
    spaceStore.spaceRole = role;
};

export const loadUserSpaces = async () => {
    try {
        let resp = await ListUserSpace();

        setUserSpaces(resp);
    } catch (e: any) {
        console.error(e);
    }
};

export default spaceStore;
