import instance from './request';

export interface LoginResponse {
    email: string;
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

export interface EmailLoginResponse {
    meta: LoginResponse;
    token: string;
    expire_at: number;
}

export async function Login(email: string, password: string): Promise<EmailLoginResponse> {
    const resp = await instance.post(`/login`, {
        email: email,
        password: password
    });

    return resp.data.data;
}

export async function UpdateUserProfile(userName: string, email: string): Promise<void> {
    return await instance.put(`/user/profile`, {
        user_name: userName,
        email: email
    });
}

export async function SendVerifyEmail(email: string): Promise<void> {
    return await instance.post(`/signup/verify/email`, {
        email: email
    });
}

export async function Signup(email: string, userName: string, password: string, verifyCode: string): Promise<void> {
    return await instance.post('/signup', {
        email: email,
        user_name: userName,
        password: password,
        verify_code: verifyCode
    });
}
