import { Icon } from '@iconify/react';
import { Avatar, AvatarGroup, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Image, Link, Tooltip, useDisclosure } from '@nextui-org/react';
import { t } from 'i18next';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import KnowledgeEdit from '@/components/knowledge-edit';
import spaceStore from '@/stores/space';

export interface KnowledgeDrawerProps {
    temporaryStorage?: string;
}

export default function App({ temporaryStorage }: KnowledgeDrawerProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    const { currentSelectedSpace } = useSnapshot(spaceStore);
    const [isLoading, setIsLoading] = useState(false);
    const editor = useRef();

    const submit = useCallback(async () => {
        setIsLoading(true);
        try {
            await editor.current.submit();
        } catch (e: any) {
            editor.current.submit();
        }
        setIsLoading(false);
    }, []);

    const resetEditor = useCallback(() => {
        editor.current.reset();
        if (temporaryStorage) {
            sessionStorage.removeItem(temporaryStorage);
        }
    }, [temporaryStorage]);

    return (
        <>
            <Button
                className="bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                startContent={<Icon icon="fluent:brain-sparkle-20-regular" width={20} />}
                variant="flat"
                size="sm"
                onPress={onOpen}
            >
                {t('Quick Create Knowledge')}
            </Button>
            <Drawer
                hideCloseButton
                backdrop="opaque"
                classNames={{
                    base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 sm:max-w-[50%] lg:max-w-[40%] rounded-medium'
                }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {onClose => (
                        <>
                            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                                <Tooltip content={t('Close')}>
                                    <Button isIconOnly className="text-default-400" size="sm" variant="light" onPress={onClose}>
                                        <svg
                                            fill="none"
                                            height="20"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                        </svg>
                                    </Button>
                                </Tooltip>
                                <div className="w-full flex justify-start items-center gap-2">
                                    <span>{t('Quick Create Knowledge')}</span>
                                </div>
                            </DrawerHeader>
                            <DrawerBody className="pt-16">
                                <KnowledgeEdit
                                    ref={editor}
                                    classNames={{ editor: 'mr-0' }}
                                    hideSubmit
                                    knowledge={{ space_id: currentSelectedSpace }}
                                    temporaryStorage={temporaryStorage}
                                    enableScrollShadow={false}
                                />
                            </DrawerBody>
                            <DrawerFooter className="flex gap-4">
                                {temporaryStorage && (
                                    <Button className="sm:w-[50%]" variant="ghost" onPress={resetEditor}>
                                        {t('reset', { title: t('editor') })}
                                    </Button>
                                )}

                                <Button
                                    className="m-auto sm:w-[50%] text-white bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                                    isLoading={isLoading}
                                    onPress={async () => {
                                        try {
                                            await submit();
                                            onClose();
                                            resetEditor();
                                        } catch (e: any) {
                                            console.error(e);
                                        }
                                    }}
                                >
                                    {t('Submit')}
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
