import { proxy } from 'valtio';

import { ListUserSpace } from '@/apis/space';
import { UserSpace } from '@/apis/space';

const spaceStore = proxy<SpaceStore>({
    spaces: [],
    currentSelectedSpace: ''
});

export const setUserSpaces = (spaces: UserSpace[]) => {
    spaceStore.spaces = spaces;
};

export const setCurrentSelectedSpace = (space: string) => {
    spaceStore.currentSelectedSpace = space;
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
