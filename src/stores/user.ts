import { enableMapSet } from 'immer';
import { proxy } from 'valtio';

import { ChangeBaseURL } from '@/apis/request';

const userStore = proxy<UserStore>({
    accessToken: localStorage.getItem('access_token'),
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

export const setUserAccessToken = (token: string) => {
    userStore.accessToken = token;
    localStorage.setItem('access_token', token);
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
