import { proxy } from 'valtio';


const eventStore = proxy<EventStore>({
    themeChange: ''
});

export const onThemeChange = (theme: string) => {
    eventStore.themeChange = theme;
};

export default eventStore;