import { Link } from '@nextui-org/react';

import { Name } from '@/components/logo';
import Navbar from '@/components/navbar';
import Footer from '@/layouts/footer';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">{children}</main>
            <footer className="w-full flex items-center justify-center py-3">
                <Footer />
            </footer>
        </div>
    );
}
