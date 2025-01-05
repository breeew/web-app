import instance from './request';

export interface SharedKnowledge {
    user_id: string;
    user_name: string;
    user_avatar: string;
    knowledge_id: string;
    space_id: string;
    kind: string;
    title: string;
    tags: string[];
    content: any;
    content_type: string;
    created_at: number;
}

export async function GetSharedKnowledge(token: string): Promise<SharedKnowledge> {
    let resp = await instance.get(`/share/knowledge/${token}`);

    return resp.data.data;
}

export interface CreateKnowledgeShareURLResponse {
    token: string;
    url: string;
}

export async function CreateKnowledgeShareURL(spaceID: string, embeddingURL: string, knowledgeID: string): Promise<CreateKnowledgeShareURLResponse> {
    let resp = await instance.post(`/space/${spaceID}/knowledge/share`, {
        embedding_url: embeddingURL,
        knowledge_id: knowledgeID
    });

    return resp.data.data;
}
