import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react';
import type { NavbarProps } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { useMedia } from '@/hooks/use-media';

const menuItems = ['About', 'Blog', 'Customers', 'Pricing', 'Enterprise', 'Changelog', 'Documentation', 'Contact Us'];

export default function Component(props: NavbarProps) {
    const { t } = useTranslation();
    const { isMobile } = useMedia();

    return (
        <>
            {isMobile || <ThemeSwitch className="rounded-full fixed top-4 right-4 z-50" />}

            <Navbar
                {...props}
                classNames={{
                    base: 'py-4 backdrop-filter-none bg-transparent',
                    wrapper: 'px-0 w-full justify-center bg-transparent',
                    item: 'hidden md:flex'
                }}
                height="54px"
            >
                <NavbarContent
                    className="gap-4 rounded-full border-small border-default-200/20 bg-background/60 px-2 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
                    justify="center"
                >
                    {/* Toggle */}
                    <NavbarMenuToggle className="ml-2 text-default-400 md:hidden" />

                    {/* Logo */}
                    <NavbarBrand className="ml-2 w-[40vw] md:w-auto md:max-w-fit">
                        <div className="rounded-full">
                            <Logo size={24} />
                        </div>
                        <span className="ml-2 font-medium md:hidden">Brew</span>
                    </NavbarBrand>

                    {/* Items */}
                    <NavbarItem>
                        <Link className="text-default-500" href="#" size="sm">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link aria-current="page" color="foreground" href="#" size="sm">
                            Roadmap
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="text-default-500" href="#" size="sm">
                            Pricing
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="text-default-500" href="#" size="sm">
                            About Us
                        </Link>
                    </NavbarItem>
                    <NavbarItem className="ml-2 !flex">
                        <Link className="text-default-500" href="/login" size="sm">
                            <Button radius="full" variant="flat">
                                {t('Login')}
                            </Button>
                        </Link>
                    </NavbarItem>
                </NavbarContent>

                {/* Menu */}
                <NavbarMenu
                    className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] max-w-[80vw] rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
                    motionProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: {
                            ease: 'easeInOut',
                            duration: 0.2
                        }
                    }}
                >
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link className="w-full text-default-500" href="#" size="md">
                                {item}
                            </Link>
                        </NavbarMenuItem>
                    ))}

                    {isMobile && <ThemeSwitch className="py-2" />}
                </NavbarMenu>
            </Navbar>
        </>
    );
}
