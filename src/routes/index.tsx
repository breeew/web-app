import { ReactNode, useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { LoginWithAccessToken } from '@/apis/user';
import { App } from '@/App';
import { autoLoginDirect } from '@/lib/utils';
import Dashboard from '@/pages/dashboard';
import ChatSession from '@/pages/dashboard/chat/chat-session.tsx';
import Chat from '@/pages/dashboard/chat/chat.tsx';
import Knowledge from '@/pages/dashboard/knowledge';
import Setting from '@/pages/dashboard/setting/setting';
import IndexPage from '@/pages/index';
import Login from '@/pages/login';
import { buildTower } from '@/stores/socket';
import spaceStore, { setCurrentSelectedSpace } from '@/stores/space';
import userStore, { setUserAccessToken, setUserInfo } from '@/stores/user';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { accessToken, userInfo } = useSnapshot(userStore);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentSelectedSpace } = useSnapshot(spaceStore);

    useEffect(() => {
        if (pathname === '/dashboard' && currentSelectedSpace) {
            navigate(`/dashboard/${currentSelectedSpace}/chat`);

            return;
        }

        if (accessToken && (!userInfo || !userInfo.userID)) {
            // load user info
            async function Login(accessToken: string) {
                try {
                    const resp = await LoginWithAccessToken(accessToken);

                    setUserInfo({
                        userID: resp.user_id,
                        email: resp.email,
                        // avatar: resp.avatar,
                        avatar: 'https://avatar.vercel.sh/' + resp.user_id,
                        userName: resp.user_name
                    });

                    buildTower(resp.user_id, accessToken, () => {
                        console.log('socket connected');
                    });
                } catch (e: any) {
                    console.error(e);

                    setUserAccessToken('');
                    navigate('/');
                }
            }
            Login(accessToken);
        }
    }, [accessToken, currentSelectedSpace]);

    return accessToken ? children : <Navigate to="/login" />;
}

const IS_FIRST_VIEW_KEY = 'brew_login_auto_redirect';

function PreLogin({ init, children }: { init: boolean; children: ReactNode }) {
    const { accessToken } = useSnapshot(userStore);

    if (accessToken) {
        setCurrentSelectedSpace('');

        if (init) {
            if (autoLoginDirect()) {
                return <Navigate to="/dashboard" />;
            }

            return children;
        }
    }

    return accessToken ? <Navigate to="/dashboard" /> : children;
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
