import { BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, Spacer, useDisclosure } from '@nextui-org/react';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { GetKnowledge, type Knowledge } from '@/apis/knowledge';
import KnowledgeDeletePopover from '@/components/knowledge-delete-popover';
import KnowledgeEdit from '@/components/knowledge-edit';
import KnowledgeView from '@/components/knowledge-view';
import { useMedia } from '@/hooks/use-media';
import spaceStore from '@/stores/space';

export interface ViewKnowledgeProps {
    onChange?: () => void;
    onDelete?: (id: string) => void;
    onClose?: () => void;
}

const ViewKnowledge = memo(
    forwardRef((props: ViewKnowledgeProps, ref: any) => {
        const { t } = useTranslation();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [knowledge, setKnowledge] = useState<Knowledge>();
        const [size, setSize] = useState<Size>('md');
        const [isEdit, setIsEdit] = useState(false);
        const { isMobile } = useMedia();
        const [canEsc, setCanEsc] = useState(true);

        const { onChange, onDelete } = props;

        const onChangeFunc = useCallback(() => {
            onChange && onChange();
            close();
        }, [onChange]);

        const onDeleteFunc = useCallback(() => {
            if (knowledge && onDelete) {
                onDelete(knowledge.id);
            }
            close();
        }, [knowledge]);

        useEffect(() => {
            if (isMobile) {
                setSize('full');
            } else {
                // TODO maybe
                // setSize('3xl');
                setSize('full');
            }
        }, [isMobile]);

        const [isLoading, setIsLoading] = useState(false);

        async function loadKnowledge(id: string) {
            setIsLoading(true);
            try {
                const resp = await GetKnowledge(currentSelectedSpace, id);

                setKnowledge(resp);
            } catch (e: any) {
                console.error(e);
                onClose();
            }
            setIsLoading(false);
        }

        function show(knowledge: Knowledge | string) {
            if (typeof knowledge === 'string') {
                loadKnowledge(knowledge);
            } else {
                setKnowledge(knowledge);
            }
            onOpen();
        }

        const { spaces, currentSelectedSpace } = useSnapshot(spaceStore);
        const spaceTitle = useMemo(() => {
            if (!currentSelectedSpace) {
                return '';
            }
            for (const item of spaces) {
                if (item.space_id === currentSelectedSpace) {
                    return item.title;
                }
            }

            return '';
        }, [spaces, currentSelectedSpace]);

        const changeEditable = useCallback(() => {
            const newState = !isEdit;

            setIsEdit(newState);
            setCanEsc(!newState);
        }, [isEdit]);

        const close = useCallback(function () {
            setIsEdit(false);
            setCanEsc(true);
            if (props.onClose) {
                props.onClose();
            }
            onClose();
        }, []);

        useImperativeHandle(ref, () => {
            return {
                show
            };
        });

        return (
            <>
                <Modal hideCloseButton backdrop="blur" placement="top-center" size={size} isOpen={isOpen} isKeyboardDismissDisabled={!canEsc} scrollBehavior="inside" onClose={close}>
                    {knowledge && !isLoading ? (
                        <ModalContent>
                            {onClose => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 dark:text-gray-100 text-gray-800">
                                        <Breadcrumbs>
                                            <BreadcrumbItem>Home</BreadcrumbItem>
                                            <BreadcrumbItem onClick={onClose}>{spaceTitle === 'Main' ? t('MainSpace') : spaceTitle}</BreadcrumbItem>
                                            <BreadcrumbItem>{knowledge.resource}</BreadcrumbItem>
                                            <BreadcrumbItem>{knowledge.id}</BreadcrumbItem>
                                        </Breadcrumbs>
                                    </ModalHeader>
                                    <ModalBody className="w-full overflow-hidden flex flex-col items-center px-0">
                                        {isEdit ? <KnowledgeEdit knowledge={knowledge} onChange={onChangeFunc} /> : <KnowledgeView knowledge={knowledge} />}
                                    </ModalBody>
                                    <ModalFooter className="flex justify-center">
                                        <ButtonGroup variant="flat" size="base" className="mb-4">
                                            <Button isDisabled={knowledge.stage !== 3} onClick={changeEditable}>
                                                {(() => {
                                                    if (knowledge.stage == 1) {
                                                        return 'Summarizing.';
                                                    } else if (knowledge.stage == 2) {
                                                        return 'Embedding.';
                                                    }

                                                    if (isEdit) {
                                                        return t('View');
                                                    } else {
                                                        return t('Edit');
                                                    }
                                                })()}
                                            </Button>
                                            <KnowledgeDeletePopover knowledge={knowledge} onDelete={onDeleteFunc}>
                                                <Button color="danger">{t('Delete')}</Button>
                                            </KnowledgeDeletePopover>

                                            <Button onPress={onClose}>
                                                {t('Close')} {canEsc && <Kbd>Esc</Kbd>}
                                            </Button>
                                        </ButtonGroup>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    ) : (
                        <ModalContent>
                            {_ => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 dark:text-gray-100 text-gray-800">
                                        <Skeleton>
                                            <Breadcrumbs>
                                                <BreadcrumbItem>Home</BreadcrumbItem>
                                                <BreadcrumbItem>Home</BreadcrumbItem>
                                                <BreadcrumbItem>Home</BreadcrumbItem>
                                                <BreadcrumbItem>Home</BreadcrumbItem>
                                            </Breadcrumbs>
                                        </Skeleton>
                                    </ModalHeader>
                                    <ModalBody className="w-full overflow-hidden flex flex-col items-center">
                                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                                        <Spacer y={2} />
                                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    </ModalBody>
                                    <ModalFooter className="flex justify-center">
                                        <Skeleton>
                                            <ButtonGroup variant="flat" size="base">
                                                <Button />
                                                <Button />
                                                <Button />
                                            </ButtonGroup>
                                        </Skeleton>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    )}
                </Modal>
            </>
        );
    })
);

export default ViewKnowledge;
