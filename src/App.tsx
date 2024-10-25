import { NextUIProvider } from '@nextui-org/system';
import { enableMapSet } from 'immer';
import { Outlet, useNavigate } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/hooks/use-theme';
import '@/lib/i18n';

export function App({ children }: { children: React.ReactNode }) {
    useTheme();
    const navigate = useNavigate();

    enableMapSet();

    return (
        <NextUIProvider navigate={navigate}>
            <Outlet />
            <Toaster />
        </NextUIProvider>
    );
}
