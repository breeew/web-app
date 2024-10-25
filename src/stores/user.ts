import { proxy } from 'valtio';

import { ChangeBaseURL } from '@/apis/request';

const userStore = proxy<UserStore>({
    accessToken: localStorage.getItem('access_token'),
    userInfo: {
        userID: '',
        userName: '',
        avatar: ''
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

export const setUserInfo = (userInfo?: { userID: string; userName: string; avatar: string }) => {
    if (!userInfo) {
        userStore.userInfo = {
            userID: '',
            userName: '',
            avatar: ''
        };
        return;
    }
    userStore.userInfo = {
        userID: userInfo.userID,
        userName: userInfo.userName,
        avatar: userInfo.avatar
    };
};

export default userStore;
