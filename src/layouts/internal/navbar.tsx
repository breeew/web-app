import { Icon } from '@iconify/react';
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { PressEvent } from '@react-types/shared/src';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import ResourceManage from '@/components/resource-modal';
import { ThemeSwitch } from '@/components/theme-switch';
import { useChatPageCondition } from '@/hooks/use-chat-page';
// import NotificationsCard from './notifications-card';
import resourceStore, { onResourceUpdate } from '@/stores/resource';

export default function Component({ onSideBarOpenChange }: { onSideBarOpenChange: (e: PressEvent) => void }) {
    const { t } = useTranslation();
    let { currentSelectedResource } = useSnapshot(resourceStore);
    const { isChat } = useChatPageCondition();
    const resourceManage = useRef<HTMLElement>();

    const navigate = useNavigate();
    const { pathname, state } = useLocation();
    const goToKnowledge = useCallback(() => {
        // TODO: 支持 keep-alive 后再使用 state
        navigate('/dashboard/knowledge', {
            // state: isChat
            //     ? {
            //           from: pathname
            //       }
            //     : ''
        });
    }, [pathname]);

    const goToChat = useCallback(() => {
        if (state && state.from) {
            navigate(-1);
        } else {
            navigate('/dashboard/chat');
        }
    }, [pathname]);

    const showResourceSetting = useCallback(() => {
        currentSelectedResource && resourceManage.current.show(currentSelectedResource);
    }, [currentSelectedResource]);

    return (
        <Navbar
            classNames={{
                base: 'bg-transparent lg:backdrop-filter-none mt-3 flex',
                item: 'data-[active=true]:text-primary',
                wrapper: 'px-2 w-full max-w-full justify-between items-center'
            }}
            height="60px"
        >
            <NavbarBrand className="flex gap-2">
                <Button isIconOnly className="sm:hidden" size="sm" variant="flat" onPress={onSideBarOpenChange}>
                    <Icon className="text-default-500" icon="solar:sidebar-minimalistic-linear" width={20} />
                </Button>
                {(() => {
                    if (isChat) {
                        return (
                            <Button
                                className="float-right text-white bg-gradient-to-br from-pink-300 from-15%  to-indigo-600 dark:from-indigo-500 dark:to-pink-500"
                                endContent={<Icon icon="material-symbols:arrow-forward-ios-rounded" />}
                                onClick={goToKnowledge}
                            >
                                {t('View Brain')}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            className="float-right text-white bg-gradient-to-br from-pink-300 from-15%  to-indigo-600 dark:from-indigo-500 dark:to-pink-500"
                            startContent={<Icon icon="material-symbols:arrow-back-ios-rounded" />}
                            onClick={goToChat}
                        >
                            {t('Back to chat')}
                        </Button>
                    );
                    // if (currentSelectedResource) {
                    //     return <h1 className="text-3xl font-bold leading-9 text-default-foreground">{currentSelectedResource.title}</h1>;
                    // }

                    // return <Skeleton className="h-6 w-1/2 rounded-lg" />;
                })()}
            </NavbarBrand>
            {!isChat && (
                <NavbarContent className="ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full px-4  lg:flex" justify="end">
                    {/* <NavbarItem>
                        <Link className="flex gap-2 text-inherit" href="#">
                            Prompt
                        </Link>
                    </NavbarItem> */}
                    {currentSelectedResource && currentSelectedResource.id && currentSelectedResource.id !== 'knowledge' && (
                        <>
                            <NavbarItem>
                                <Button radius="full" variant="ghost" className="flex gap-2 text-inherit" onClick={showResourceSetting}>
                                    {t('Resource Setting')}
                                </Button>
                            </NavbarItem>
                            <ResourceManage
                                ref={resourceManage}
                                onModify={() => {
                                    onResourceUpdate();
                                }}
                            />
                        </>
                    )}
                </NavbarContent>
            )}

            <NavbarContent className="flex h-12 max-w-fit items-center gap-0 rounded-full p-0 bg-content2 lg:px-1 dark:bg-content1" justify="end">
                <NavbarItem className="flex">
                    <Button isIconOnly radius="full" variant="light">
                        <Icon className="text-default-500" icon="solar:magnifer-linear" width={22} />
                    </Button>
                </NavbarItem>
                <NavbarItem className="flex">
                    <Button isIconOnly radius="full" variant="light">
                        <ThemeSwitch />
                    </Button>
                </NavbarItem>
                {/* <NavbarItem className="flex">
                    <Popover offset={12} placement="bottom-end">
                        <PopoverTrigger>
                            <Button disableRipple isIconOnly className="overflow-visible" radius="full" variant="light">
                                <Badge color="danger" content="5" showOutline={false} size="md">
                                    <Icon className="text-default-500" icon="solar:bell-linear" width={22} />
                                </Badge>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                            <NotificationsCard className="w-full shadow-none" />
                        </PopoverContent>
                    </Popover>
                </NavbarItem> */}
            </NavbarContent>

            {/* Mobile Menu */}
        </Navbar>
    );
}
