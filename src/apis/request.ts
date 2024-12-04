import axios, { AxiosError } from 'axios';

import { toast } from '@/hooks/use-toast';
import i18n from '@/lib/i18n';
import userStore from '@/stores/user';

const instance = axios.create({
    baseURL: userStore.host
});

export function ChangeBaseURL(url: string) {
    instance.defaults.baseURL = url;
}

const ACCESS_TOKEN_KEY = 'X-Access-Token';
const ACCEPT_LANGUAGE_KEY = 'Accept-Language';

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        config.headers.setContentType('application/json');
        if (!config.headers.get(ACCESS_TOKEN_KEY)) {
            config.headers.set(ACCESS_TOKEN_KEY, userStore.accessToken);
        }
        config.headers.set(ACCEPT_LANGUAGE_KEY, i18n.language);

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (axios.isAxiosError(error)) {
            handleAxiosError(error);
        }

        return Promise.reject(error);
    }
);

function handleAxiosError(error: AxiosError) {
    toast({
        title: 'Request Error',
        // @ts-ignore
        description: error.response ? error.response.data.meta.message + ', ' + error.message : error.message
    });
}

export default instance;
