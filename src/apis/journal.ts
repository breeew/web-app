export interface Journal {
    id: string;
    title: string;
    space_id: string;
    user_id: string;
    blocks: OutputData;
    created_at: number;
    updated_at: number;
}
