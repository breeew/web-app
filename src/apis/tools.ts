import instance from './request';

export async function DescribeImage(url: string): Promise<string> {
    const resp = await instance.post(`/tools/describe/image`, {
        url: url
    });

    return resp.data.data.content;
}
