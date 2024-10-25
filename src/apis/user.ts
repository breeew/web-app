import instance from './request';

export async function Login() {}

export interface LoginResponse {
    user_name: string;
    user_id: string;
    avatar: string;
}

export async function LoginWithAccessToken(accessToken: string): Promise<LoginResponse> {
    const resp = await instance.post(
        `/login/token`,
        {},
        {
            headers: {
                'X-Access-Token': accessToken
            }
        }
    );

    return resp.data.data;
}
