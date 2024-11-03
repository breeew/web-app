import { proxy } from 'valtio';

const eventStore = proxy<EventStore>({
    themeChange: false,
    onKnowledgeSearch: false
});

export const onThemeChange = () => {
    eventStore.themeChange = !eventStore.themeChange;
};

export const tiggerKnowledgeSearch = () => {
    eventStore.onKnowledgeSearch = !eventStore.onKnowledgeSearch;
};

export default eventStore;
