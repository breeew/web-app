import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSnapshot } from 'valtio';

import { Resource } from '@/apis/resource';
import { CopyKnowledge } from '@/apis/share';
import { GetUserInfo, ListUserResources } from '@/apis/user';
import { GithubIcon } from '@/components/icons';
import { LogoIcon, Name } from '@/components/logo';
import spaceStore, { loadUserSpaces } from '@/stores/space';
import userStore, { setUserInfo } from '@/stores/user';

export interface ShareHeaderProps {
    controlsContent: React.ReactNode;
}

export default memo(({ controlsContent }: ShareHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = useParams(); // share token

    const { userInfo, accessToken, loginToken } = useSnapshot(userStore);
    const [userResources, setUserResources] = useState<Map<string, Resource[]>>();
    const [isLoadUserInfo, setIsLoadUserInfo] = useState(true);
    const [resourceSelector, setResourceSelector] = useState<Resource[]>([]);
    const { spaces } = useSnapshot(spaceStore);

    function groupResourcesBySpace(resources: Resource[]): Map<string, Resource[]> {
        return resources.reduce((acc, resource) => {
            if (!acc.has(resource.space_id)) {
                acc.set(resource.space_id, []);
            }
            acc.get(resource.space_id)!.push(resource);
            return acc;
        }, new Map<string, Resource[]>());
    }

    async function loudUserInfo() {
        setIsLoadUserInfo(true);
        try {
            const resp = await GetUserInfo();
            setUserInfo({
                userID: resp.user_id,
                avatar: resp.avatar || 'https://avatar.vercel.sh/' + resp.user_id,
                userName: resp.user_name,
                email: resp.email,
                planID: resp.plan_id,
                serviceMode: resp.service_mode
            });

            await loadUserSpaces();
            const resources = await ListUserResources();
            setUserResources(groupResourcesBySpace(resources));
            console.log(groupResourcesBySpace(resources));
        } catch (e: any) {
            console.error(e);
        }
        setIsLoadUserInfo(false);
    }

    useEffect(() => {
        if (!accessToken && !loginToken) {
            setIsLoadUserInfo(false);
            return;
        }

        loudUserInfo();
    }, [accessToken, loginToken]);

    const canBeSelectSpaces = useMemo(() => {
        var canSelect: UserSpace[] = [];

        spaces.forEach(v => {
            if (userResources?.get(v.space_id)) {
                canSelect.push(v);
            }
        });

        return canSelect;
    }, [spaces, userResources]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedSpace, setSelectedSpace] = useState<string>('');
    const onSpaceSelect = useCallback(
        e => {
            if (!e.target.value) {
                return;
            }
            setSelectedSpace(e.target.value);

            const list = userResources?.get(e.target.value);
            setResourceSelector(list);
        },
        [userResources]
    );

    const [selectedResource, setSelectedResource] = useState<string>('');
    const onResourceSelect = useCallback(e => {
        setSelectedResource(e.target.value);
    }, []);

    const showSaveMemory = useCallback(() => {
        onOpen();
    }, []);

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const submitCopy = useCallback(async () => {
        setSaveLoading(true);
        try {
            await CopyKnowledge(token, selectedSpace, selectedResource);
            toast.success(t('Success'));
            onOpenChange();
        } catch (e: any) {
            console.error(e);
        }
        setSaveLoading(false);
    }, [selectedResource, selectedSpace]);

    const onModalOpenChange = useCallback(() => {
        setSelectedResource('');
        setSelectedSpace('');
        setResourceSelector([]);
    }, []);

    return (
        <header className="flex w-full items-center gap-2 sm:gap-4 pb-4 flex-row justify-between">
            <div className="flex items-center gap-2">
                <Link target="_parent" href="/">
                    <LogoIcon />
                    <h1 className=" dark:text-white text-black">{Name}</h1>
                </Link>
                <Popover>
                    <PopoverTrigger>
                        <Button isIconOnly className="flex lg:hidden" radius="full" size="sm" variant="flat">
                            <Icon icon="solar:menu-dots-bold" width={24} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="fle-col flex max-h-[40vh] w-[300px] justify-start gap-3 overflow-scroll p-4">{controlsContent}</PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center gap-2">
                {!isLoadUserInfo && (
                    <>
                        {canBeSelectSpaces && canBeSelectSpaces.length > 0 ? (
                            <>
                                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} onClose={onModalOpenChange}>
                                    <ModalContent>
                                        {onClose => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">{t('SaveItTo')}</ModalHeader>
                                                <ModalBody className="flex flex-col gap-4">
                                                    <Select
                                                        isRequired
                                                        variant="bordered"
                                                        label={t('Workspace')}
                                                        labelPlacement="outside"
                                                        placeholder="Select your work space"
                                                        selectedKeys={[selectedSpace]}
                                                        size="lg"
                                                        onChange={onSpaceSelect}
                                                    >
                                                        {canBeSelectSpaces.map(item => (
                                                            <SelectItem key={item.space_id}>{item.title}</SelectItem>
                                                        ))}
                                                    </Select>
                                                    {resourceSelector.length > 0 && (
                                                        <Select
                                                            isRequired
                                                            variant="bordered"
                                                            label={t('Resource List')}
                                                            labelPlacement="outside"
                                                            placeholder="Select resource type"
                                                            size="lg"
                                                            selectedKeys={[selectedResource]}
                                                            onChange={onResourceSelect}
                                                        >
                                                            {resourceSelector.map(item => (
                                                                <SelectItem key={item.id}>{item.title}</SelectItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                    <div className="flex py-2 px-1 justify-end text-sm text-zinc-500">
                                                        <span>{t('SaveMemoryNotice')}</span>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" variant="flat" onPress={onClose}>
                                                        {t('Close')}
                                                    </Button>
                                                    <Button color="primary" isLoading={saveLoading} onPress={submitCopy}>
                                                        {t('Submit')}
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                                <Button
                                    className="bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                                    startContent={<Icon icon="fluent:brain-sparkle-20-regular" width={20} />}
                                    variant="flat"
                                    size="sm"
                                    onPress={showSaveMemory}
                                >
                                    {t('SaveMemory')}
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                                startContent={<Icon icon="fluent:brain-sparkle-20-regular" width={20} />}
                                variant="flat"
                                size="sm"
                                onPress={() => {
                                    window.parent.location.href = '/';
                                }}
                            >
                                {t('StartCyberMemory')}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </header>
    );
});
