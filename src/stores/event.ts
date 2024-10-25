import { proxy } from 'valtio';

const eventStore = proxy<EventStore>({
    themeChange: false
});

export const onThemeChange = () => {
    eventStore.themeChange = !eventStore.themeChange;
};

export default eventStore;
