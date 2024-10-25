import { proxy } from 'valtio';

const resourceStore = proxy<ResourceStore>({
    currentSelectedResource: undefined,
    currentSpaceResources: undefined,
    onResourceUpdate: false
});

export const setCurrentSelectedResource = (data: Resource) => {
    resourceStore.currentSelectedResource = data;
};

export const setSpaceResource = (list: Resource[]) => {
    resourceStore.currentSpaceResources = list;
};

export const onResourceUpdate = () => {
    resourceStore.onResourceUpdate = !resourceStore.onResourceUpdate;
};

export default resourceStore;
