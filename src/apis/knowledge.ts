import instance from './request';

export interface Knowledge {
    content: string;
    id: string;
    kind: string;
    maybe_date: string;
    resource: string;
    retry_times: string;
    space_id: string;
    stage: number;
    summary: string;
    tags: string[];
    title: string;
    user_id: string;
    created_at: number;
    updated_at: number;
}

export interface ListKnowledgeResponse {
    list: Knowledge[];
    total: number;
}

export async function ListKnowledge(spaceID: string, resource: string = '', page: number, pageSize: number): Promise<ListKnowledgeResponse> {
    const resp = await instance.get(`/${spaceID}/knowledge/list`, {
        params: {
            page: page,
            pagesize: pageSize,
            resource
        }
    });

    return resp.data.data;
}

export async function GetKnowledge(spaceID: string, knowledgeID: string): Promise<Knowledge> {
    const resp = await instance.get(`/${spaceID}/knowledge`, {
        params: {
            id: knowledgeID
        }
    });

    return resp.data.data;
}

export async function CreateKnowledge(spaceID: string, resource: string, content: string, async: boolean = true): Promise<string> {
    const resp = await instance.post(`/${spaceID}/knowledge`, {
        resource,
        content,
        async
    });

    return resp.data.data.id;
}

export interface UpdateKnowledgeArgs {
    title: string;
    content: string;
    tags: string[];
    resource: string;
    kind?: string;
}

export async function UpdateKnowledge(spaceID: string, id: string, args: UpdateKnowledgeArgs): Promise<void> {
    await instance.put(`/${spaceID}/knowledge`, {
        id,
        ...args
    });
}

export async function DeleteKnowledge(spaceID: string, id: string): Promise<void> {
    await instance.delete(`/${spaceID}/knowledge`, {
        data: {
            id
        }
    });
}

interface QueryResponse {
    refs: QueryRefs[];
    message: string;
}

interface QueryRefs {
    id: string;
    knowledge_id: string;
    cos: number;
}

export async function Query(spaceID: string, query: string): Promise<QueryResponse> {
    const resp = await instance.post(`/${spaceID}/knowledge/query`, {
        query
    });

    return resp.data.data;
}
