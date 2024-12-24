import { proxy } from 'valtio';

import { ChangeBaseURL } from '@/apis/request';

const userStore = proxy<UserStore>({
    accessToken: localStorage.getItem('access_token'),
    loginToken: localStorage.getItem('login_token'),
    userInfo: {
        userID: '',
        userName: '',
        avatar: '',
        email: ''
    },
    host: localStorage.getItem('self-host') || import.meta.env.VITE_BASE_URL
});

export const setHost = (host: string) => {
    userStore.host = host;
    localStorage.setItem('self-host', host);
    ChangeBaseURL(host);
};

export const logout = () => {
    userStore.accessToken = '';
    userStore.loginToken = '';
    userStore.userInfo = {};
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_token');
};

export const setUserAccessToken = (token: string) => {
    userStore.accessToken = token;
    localStorage.setItem('access_token', token);
};

export const setUserLoginToken = (token: strint) => {
    userStore.loginToken = token;
    localStorage.setItem('login_token', token);
};

export const setUserInfo = (userInfo?: { userID: string; userName: string; email: string; avatar: string }) => {
    if (!userInfo) {
        userStore.userInfo = {
            email: '',
            userID: '',
            userName: '',
            avatar: ''
        };

        return;
    }
    userStore.userInfo = {
        userID: userInfo.userID,
        userName: userInfo.userName,
        avatar: userInfo.avatar,
        email: userInfo.email
    };
};

export default userStore;
