import instance from './request';

export interface UserSpace {
    space_id: string;
    user_id: string;
    role: string;
    title: string;
    description: string;
    created_at: number;
}

export async function ListUserSpace(): Promise<UserSpace[]> {
    let resp = await instance.get(`/space/list`);

    return resp.data.data.list;
}

export async function CreateUserSpace(title: string, description: string): Promise<void> {
    await instance.post(`/space`, {
        title,
        description
    });
}
