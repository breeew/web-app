import { proxy } from 'valtio';

const knowledgeStore = proxy<KnowledgeStore>({
    searchKeywords: ''
});

export const onKnowledgeSearchKeywordsChange = (value: string) => {
    knowledgeStore.searchKeywords = value;
};

export default knowledgeStore;
