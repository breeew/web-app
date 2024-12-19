'use client';

import { NextUIProvider } from '@nextui-org/react';
import { enableMapSet } from 'immer';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { subscribeKey } from 'valtio/utils';

import { setNotAutoLoginDirect } from './lib/utils';
import eventStore from './stores/event';

import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/hooks/use-theme';
import '@/lib/i18n';

export function App({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const navigate = useNavigate();

    enableMapSet();

    const [currentTheme, setCurrentTheme] = useState(theme);

    useEffect(() => {
        const unSubscribe = subscribeKey(eventStore, 'themeChange', (theme: string) => {
            setCurrentTheme(theme);
        });

        return unSubscribe;
    });

    useEffect(() => {
        const isDark = currentTheme === 'dark';
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.id = 'highlight-theme';
        link.href = isDark ? '/css/hljs-github-dark.min.css' : '/css/hljs-github.min.css';
        document.head.appendChild(link);

        // 清除之前加载的主题样式
        return () => {
            const existingLink = document.getElementById('highlight-theme');

            if (existingLink) {
                existingLink.remove();
            }
        };
    }, [currentTheme]);

    setTimeout(() => {
        setNotAutoLoginDirect();
    }, 1000);

    return (
        <NextUIProvider navigate={navigate}>
            <Outlet />
            <Toaster />
            <span className="bg-zinc-800" />
        </NextUIProvider>
    );
}
