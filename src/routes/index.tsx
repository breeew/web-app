import axios from 'axios';
import { ReactNode, useEffect, useMemo } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { LoginWithAccessToken } from '@/apis/user';
import { App } from '@/App';
import { autoLoginDirect } from '@/lib/utils';
import Dashboard from '@/pages/dashboard';
import ChatSession from '@/pages/dashboard/chat/chat-session.tsx';
import Chat from '@/pages/dashboard/chat/chat.tsx';
import Journal from '@/pages/dashboard/journal/journal';
import Knowledge from '@/pages/dashboard/knowledge';
import Setting from '@/pages/dashboard/setting/setting';
import Forgot from '@/pages/forgot';
import IndexPage from '@/pages/index';
import Login from '@/pages/login';
import Reset from '@/pages/reset';
import { buildTower } from '@/stores/socket';
import spaceStore, { setCurrentSelectedSpace } from '@/stores/space';
import userStore, { setUserAccessToken, setUserInfo } from '@/stores/user';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { accessToken, loginToken, userInfo } = useSnapshot(userStore);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentSelectedSpace } = useSnapshot(spaceStore);

    const isLogin = useMemo(() => {
        return accessToken || loginToken;
    }, [accessToken, loginToken]);

    useEffect(() => {
        if (pathname === '/dashboard' && currentSelectedSpace) {
            navigate(`/dashboard/${currentSelectedSpace}/chat`);

            return;
        }

        if (isLogin && (!userInfo || !userInfo.userID)) {
            // load user info
            async function Login(type: string, accessToken: string) {
                try {
                    const resp = await LoginWithAccessToken(accessToken);

                    setUserInfo({
                        userID: resp.user_id,
                        email: resp.email,
                        // avatar: resp.avatar,
                        avatar: 'https://avatar.vercel.sh/' + resp.user_id,
                        userName: resp.user_name
                    });

                    if (type == 'authorization') {
                        accessToken = `${accessToken}&token-type=authorization`;
                    }
                    buildTower(resp.user_id, accessToken, () => {
                        console.log('socket connected');
                    });
                } catch (e: any) {
                    if (axios.isAxiosError(e) && e.code === '403') {
                        setUserAccessToken('');
                    }

                    navigate('/');
                }
            }
            Login(accessToken ? '' : 'authorization', accessToken || loginToken);
        }
    }, [isLogin, currentSelectedSpace]);

    return isLogin ? children : <Navigate to="/login" />;
}

function PreLogin({ init, children }: { init: boolean; children: ReactNode }) {
    const { accessToken, loginToken } = useSnapshot(userStore);
    const isLogin = useMemo(() => {
        return accessToken || loginToken;
    }, [accessToken, loginToken]);

    if (isLogin) {
        setCurrentSelectedSpace('');

        if (init) {
            if (autoLoginDirect()) {
                return <Navigate to="/dashboard" />;
            }

            return children;
        }
    }

    return isLogin ? <Navigate to="/dashboard" /> : children;
}

const routes = createBrowserRouter([
    {
        path: '*',
        element: <Navigate to="/login" />
    },
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                path: '/',
                element: (
                    <PreLogin init>
                        <IndexPage />
                    </PreLogin>
                )
            },
            {
                path: '/login',
                element: (
                    <PreLogin>
                        <Login />
                    </PreLogin>
                )
            },
            {
                path: '/reset/password/:token',
                element: <Reset />
            },
            {
                path: '/forgot/password',
                element: <Forgot />
            },
            {
                path: '/dashboard/:spaceID/journal/:selectDate',
                element: (
                    <ProtectedRoute>
                        <Journal />
                    </ProtectedRoute>
                )
            },
            {
                path: '/dashboard/',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: ':spaceID/knowledge',
                        element: <Knowledge />
                    },
                    {
                        path: ':spaceID/chat',
                        element: <Chat />
                    },
                    {
                        path: ':spaceID/chat/session/:sessionID',
                        element: <ChatSession />
                    }
                ]
            },
            {
                path: '/user/*',
                element: (
                    <ProtectedRoute>
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: 'setting',
                        element: <Setting />
                    }
                ]
            }
        ]
    }
]);

export default routes;
