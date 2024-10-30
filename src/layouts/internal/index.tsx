import { Icon } from '@iconify/react';
import { Button, Card, CardBody, CardFooter, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link, ScrollShadow, Skeleton, Spacer, useDisclosure, User } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import React, { Key, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useSnapshot } from 'valtio';
import { subscribeKey } from 'valtio/utils';

import NavBar from './navbar';
import Sidebar from './sidebar';
import SidebarDrawer from './sidebar-drawer';
import WorkSpaceSelection from './space-selection';

import { ChatSession, GetChatSessionList } from '@/apis/chat';
import { ListResources } from '@/apis/resource';
import { GithubIcon, Logo } from '@/components/icons';
import ResourceManage from '@/components/resource-modal';
import { useChatPageCondition } from '@/hooks/use-chat-page';
import { useMedia } from '@/hooks/use-media';
import resourceStore, { setCurrentSelectedResource, setSpaceResource } from '@/stores/resource';
import sessionStore, { setCurrentSelectedSession } from '@/stores/session';
import { closeSocket } from '@/stores/socket';
import spaceStore from '@/stores/space';
import userStore, { setUserAccessToken, setUserInfo } from '@/stores/user';

interface SidebarItem {
    id: string;
    title: string;
}

export default function Component({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isOpen, onOpenChange } = useDisclosure();
    const [isCollapsed, _] = React.useState(false);
    const { isMobile } = useMedia();
    const { currentSelectedSpace } = useSnapshot(spaceStore);
    const { currentSelectedResource } = useSnapshot(resourceStore);
    const { currentSelectedSession } = useSnapshot(sessionStore);
    const { userInfo } = useSnapshot(userStore);
    const { isChat, isSession } = useChatPageCondition();
    const { sessionID } = useParams();

    const { resourceList, resourceLoading, listResource } = useResourceMode();

    const resourceManage = useRef<HTMLElement>();
    const showCreateResource = useCallback(() => {
        if (resourceManage.current) {
            resourceManage.current.show();
        }
    }, [resourceManage]);

    const onResourceModify = useCallback(() => {
        listResource(currentSelectedSpace);
    }, [currentSelectedSpace]);

    const { sessionLoading, sessionList, reload } = useChatMode();

    useEffect(() => {
        if (!currentSelectedSpace) {
            return;
        }
        if (isChat) {
            !sessionList.find(v => {
                return v.id === sessionID && v.space_id === currentSelectedSpace;
            }) && reload(currentSelectedSpace);

            return;
        }
        // not chat mode logic
        listResource(currentSelectedSpace);
    }, [currentSelectedSpace, isChat, sessionID]);

    useEffect(() => {
        if (!sessionID && !currentSelectedSession?.key) {
            return;
        }
        if (!sessionID || (currentSelectedSession?.space_id !== '' && currentSelectedSession?.space_id !== currentSelectedSpace)) {
            setCurrentSelectedSession({
                key: '',
                title: '',
                space_id: ''
            });

            return;
        }

        for (const item of sessionList) {
            if (item.id === sessionID) {
                setCurrentSelectedSession({
                    key: item.id,
                    title: item.title,
                    space_id: item.space_id
                });
                break;
            }
        }
    }, [sessionID, sessionList, currentSelectedSpace]);

    // @ts-ignore
    const userAction = useCallback((actionName: Key) => {
        switch (actionName) {
            case 'logout':
                closeSocket();
                setUserInfo(undefined);
                setUserAccessToken('');
                navigate('/');
                break;
            case 'setting':
                navigate('/user/setting');
                break;
            default:
        }
    }, []);

    const createNewSession = useCallback(() => {
        navigate(`/dashboard/${currentSelectedSpace}/chat`);
    }, [currentSelectedSpace]);

    const redirectSession = useCallback(
        (key: string) => {
            navigate(`/dashboard/${currentSelectedSpace}/chat/session/${key}`);
        },
        [currentSelectedSpace]
    );

    return (
        <div className="flex h-dvh w-full gap-4 dark:bg-zinc-900">
            {/* Sidebar */}
            <SidebarDrawer className={'min-w-[288px] rounded-lg'} hideCloseButton={true} isOpen={isOpen} onOpenChange={onOpenChange}>
                <div
                    className={cn('will-change relative flex w-72 flex-col bg-default-100 p-6 transition-width h-dvh', {
                        'w-[83px] items-center px-[6px] py-6': isCollapsed
                    })}
                >
                    <div className="flex items-center justify-between">
                        <Link color="foreground" href="/" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-2">
                                <Logo size={20} />

                                <span className="text-lg font-bold">Brew</span>
                            </div>
                        </Link>
                        {/* <div className="flex items-center justify-end">
                            <div className={cn('flex-end flex', { hidden: isCollapsed })}>
                                <Icon
                                    className="cursor-pointer dark:text-primary-foreground/60 [&>g]:stroke-[1px]"
                                    icon="solar:round-alt-arrow-left-line-duotone"
                                    width={24}
                                    onClick={isMobile ? onOpenChange : onToggle}
                                />
                            </div>
                        </div> */}
                    </div>

                    <Spacer y={8} />

                    <div className="flex flex-col gap-y-2">
                        <WorkSpaceSelection />
                        <Spacer y={4} />
                        {isChat ? (
                            <Button className="mx-1" startContent={<Icon icon="material-symbols:forum-rounded" width={24} />} onClick={createNewSession}>
                                {t('New Session')}
                            </Button>
                        ) : (
                            <>
                                <Button className="mx-1" startContent={<Icon icon="material-symbols:auto-awesome-motion" width={24} />} onClick={showCreateResource}>
                                    {t('New Resource')}
                                </Button>
                                <ResourceManage ref={resourceManage} onModify={onResourceModify} />
                                {/* <Spacer y={2} /> */}
                                {/* <Input
                                    fullWidth
                                    aria-label="search"
                                    classNames={{
                                        base: 'px-1',
                                        input: 'dark:bg-default-50',
                                        inputWrapper: 'dark:bg-default-50 data-[focus]:dark:bg-default-50'
                                    }}
                                    labelPlacement="outside"
                                    placeholder="Search resources"
                                    startContent={<Icon className="text-default-500 [&>g]:stroke-[2px]" icon="solar:magnifer-linear" width={18} />}
                                /> */}
                            </>
                        )}
                    </div>

                    <div className="pt-6 px-3 text-zinc-500 text-sm">{isChat ? t('Chat Sessions') : t('Resource List')}</div>
                    <Spacer y={1} />

                    <ScrollShadow hideScrollBar className="-mr-6 h-full max-h-full py-3 pr-6">
                        {resourceLoading || (sessionLoading && sessionList.length === 0) ? (
                            <div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-3 w-3/5 rounded-lg" />
                                <Skeleton className="h-3 w-4/5 rounded-lg" />
                                <Spacer y={2} />
                                <Skeleton className="h-3 w-3/5 rounded-lg" />
                                <Skeleton className="h-3 w-4/5 rounded-lg" />
                            </div>
                        ) : (
                            (() => {
                                if (isChat) {
                                    return (
                                        <Sidebar
                                            defaultSelectedKey={currentSelectedSession?.key}
                                            iconClassName="group-data-[selected=true]:text-primary-foreground"
                                            itemClasses={{
                                                base: 'data-[selected=true]:bg-primary-400 data-[selected=true]:focus:bg-primary-400 dark:data-[selected=true]:bg-primary-300 data-[hover=true]:bg-default-300/20 dark:data-[hover=true]:bg-default-200/40',
                                                title: 'group-data-[selected=true]:text-primary-foreground'
                                            }}
                                            items={sessionList.map(v => {
                                                return {
                                                    key: v.id,
                                                    title: v.title || v.id
                                                };
                                            })}
                                            onSelect={key => {
                                                for (const item of sessionList) {
                                                    if (item.id === key) {
                                                        setCurrentSelectedSession({
                                                            key: key,
                                                            title: item.title,
                                                            space_id: item.space_id
                                                        });
                                                        redirectSession(key);
                                                        break;
                                                    }
                                                }
                                                if (isMobile && isOpen) {
                                                    onOpenChange();
                                                }
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <Sidebar
                                            defaultSelectedKey={currentSelectedResource?.id}
                                            iconClassName="group-data-[selected=true]:text-primary-foreground"
                                            itemClasses={{
                                                base: 'data-[selected=true]:bg-primary-400 data-[selected=true]:focus:bg-primary-400 dark:data-[selected=true]:bg-primary-300 data-[hover=true]:bg-default-300/20 dark:data-[hover=true]:bg-default-200/40',
                                                title: 'group-data-[selected=true]:text-primary-foreground'
                                            }}
                                            items={resourceList}
                                            onSelect={key => {
                                                for (const item of resourceList) {
                                                    if (item.id === key) {
                                                        setCurrentSelectedResource(item);
                                                        break;
                                                    }
                                                }
                                                if (isMobile && isOpen) {
                                                    onOpenChange();
                                                }
                                            }}
                                        />
                                    );
                                }
                            })()
                        )}

                        <Spacer y={8} />
                        {/* <Card className="mx-2 overflow-visible" shadow="sm">
                            <CardBody className="items-center py-5 text-center">
                                <h3 className="text-medium font-medium text-default-700">
                                    {t('Upgrade to Pro')}
                                    <span aria-label="rocket-emoji" className="ml-2" role="img">
                                        🚀
                                    </span>
                                </h3>
                                <p className="p-4 text-small text-default-500">{t('preProInfo')}</p>
                            </CardBody>
                            <CardFooter className="absolute -bottom-8 justify-center">
                                <Button className="px-10" color="primary" radius="full">
                                    {t('Upgrade')}
                                </Button>
                            </CardFooter>
                        </Card> */}
                        <Card className="mx-2 overflow-visible" shadow="sm">
                            <CardBody className="items-center py-5 text-center">
                                <h3 className="text-medium font-medium text-default-700">
                                    Sponsor
                                    <span aria-label="rocket-emoji" className="ml-2" role="img">
                                        🚀
                                    </span>
                                </h3>
                                <p className="p-4 text-small text-default-500">⭐️ Give us a star</p>
                            </CardBody>
                            <CardFooter className="absolute -bottom-8 justify-center">
                                <Link isExternal href="https://github.com/breeew/brew">
                                    <Button className="px-10" color="primary" radius="full">
                                        <GithubIcon />
                                        Github
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </ScrollShadow>

                    <Dropdown placement="top" className="w-full">
                        <DropdownTrigger>
                            {userInfo && userInfo.userID ? (
                                <Button
                                    className="mb-4 h-20 items-center justify-between"
                                    variant="bordered"
                                    endContent={
                                        <>
                                            <Chip
                                                variant="shadow"
                                                size="sm"
                                                classNames={{
                                                    base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
                                                    content: 'drop-shadow shadow-black text-white'
                                                }}
                                            >
                                                Pro
                                            </Chip>
                                            <Icon className="text-default-400" icon="lucide:chevrons-up-down" width={16} />
                                        </>
                                    }
                                >
                                    <User
                                        avatarProps={{
                                            size: 'sm',
                                            isBordered: false,
                                            src: userInfo.avatar
                                        }}
                                        className="justify-start transition-transform"
                                        // description={userInfo.role}
                                        name={userInfo.userName}
                                    />
                                </Button>
                            ) : (
                                <div className="w-full mb-6 flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                </div>
                            )}
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Account switcher" variant="flat" onAction={userAction}>
                            <DropdownItem key="setting" textValue="setting">
                                <div className="flex items-center gap-x-3">
                                    <div className="flex flex-col">
                                        <p className="text-small font-medium text-default-600">{t('Setting')}</p>
                                    </div>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" textValue="logout">
                                <div className="flex items-center gap-x-3">
                                    <div className="flex flex-col">
                                        <p className="text-small font-medium text-default-600">{t('Logout')}</p>
                                    </div>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </SidebarDrawer>
            <div className="w-full h-full flex flex-col overflow-hidden">
                <NavBar onSideBarOpenChange={onOpenChange} />

                {children}
            </div>
            {!isMobile ? <div>{/* for gap, dont delete */}</div> : <></>}
        </div>
    );
}

function useResourceMode() {
    const { t } = useTranslation();
    const [resourceList, setResourceList] = useState<SidebarItem[]>([]);
    const [resourceLoading, setResourceLoading] = useState(false);
    const { currentSelectedResource } = useSnapshot(resourceStore);
    const { currentSelectedSpace } = useSnapshot(spaceStore);

    useEffect(() => {
        if (!currentSelectedSpace) {
            return;
        }
        subscribeKey(resourceStore, 'onResourceUpdate', () => {
            listResource(currentSelectedSpace);
        });
    }, [currentSelectedSpace]);

    async function listResource(spaceID: string) {
        setResourceLoading(true);
        try {
            let resp = await ListResources(spaceID);
            const items: SidebarItem[] = [
                {
                    id: '',
                    title: t('All')
                }
            ];

            let currentSelectedResourceAlreadyExist = false;

            resp.forEach(v => {
                if (currentSelectedResource && currentSelectedResource.id && v.id === currentSelectedResource.id && v.space_id === currentSelectedResource.space_id) {
                    currentSelectedResourceAlreadyExist = true;
                }
                items.push({
                    id: v.id,
                    title: v.title,
                    cycle: v.cycle,
                    space_id: v.space_id,
                    description: v.description
                });
            });

            if (!currentSelectedResourceAlreadyExist) {
                setCurrentSelectedResource(items[0]);
            }

            setSpaceResource(items);
            setResourceList(items);
        } catch (e: any) {
            console.error(e);
        }
        setResourceLoading(false);
    }

    return {
        resourceList,
        setResourceList,
        resourceLoading,
        listResource
    };
}

function useChatMode() {
    const [sessionList, setSessionList] = useImmer<ChatSession[]>([]);
    const [sessionLoading, setSessionLoading] = useState<boolean>(false);
    const pageSize = 10;
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        const unSubscribe = subscribeKey(sessionStore, 'sessionNamedEvent', (data: SessionNamedEvent | undefined) => {
            if (!data) {
                return;
            }
            setSessionList((prev: ChatSession[]) => {
                const todo = prev.find(v => v.id === data.sessionID);

                if (todo) {
                    todo.title = data.name;
                }
            });
        });

        return unSubscribe;
    }, [sessionList]);

    const loadData = useCallback(
        async (spaceID: string, page: number) => {
            if (!hasMore && page !== 1) {
                return;
            }
            setSessionLoading(true);
            try {
                const resp = await GetChatSessionList(spaceID, page, pageSize);

                setPage(page);
                if (page * pageSize >= resp.total) {
                    setHasMore(false);
                }

                if (page === 1) {
                    setSessionList(resp.list || []);
                } else if (resp.list) {
                    setSessionList((prev: ChatSession[]) => {
                        return prev.concat(resp.list);
                    });
                }
                setTotal(resp.total);
            } catch (e: any) {
                console.error(e);
            }
            setSessionLoading(false);
        },
        [hasMore, sessionList]
    );

    const reload = useCallback(async (spaceID: string) => {
        if (!spaceID) {
            return;
        }
        setHasMore(true);
        await loadData(spaceID, 1);
    }, []);

    const loadNext = useCallback(
        async (spaceID: string) => {
            if (!hasMore || !spaceID) {
                return;
            }
            await loadData(spaceID, page + 1);
        },
        [page]
    );

    return {
        sessionLoading,
        sessionList,
        reload,
        loadNext
    };
}
