import { Icon } from '@iconify/react';
import { Button, Checkbox, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/hooks/use-toast';

export interface ShareLinkModalProps {}

const ShareLinkModal = memo(
    forwardRef((props: ShareLinkModalProps, ref: any) => {
        const { t } = useTranslation();
        const { isOpen, onOpen, onOpenChange } = useDisclosure();
        const [link, setLink] = useState('');
        const show = (link: string) => {
            setLink(link);
            onOpen();
        };

        const { toast } = useToast();

        const input = useRef();
        const copyLink = useCallback(() => {
            if (input.current) {
                input.current.select();
                document.execCommand('copy');
                toast({
                    title: t('Success'),
                    description: t('LinkCopied')
                });
                onOpenChange();
            }
        }, [link, input]);

        useImperativeHandle(ref, () => {
            return {
                show
            };
        });
        return (
            <>
                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                    <ModalContent>
                        {onClose => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 pb-2">{t('ShareLink')}</ModalHeader>
                                <ModalBody>
                                    {link && (
                                        <Input
                                            ref={input}
                                            endContent={
                                                <button onClick={copyLink}>
                                                    <Icon icon="tabler:copy" />
                                                </button>
                                            }
                                            readOnly
                                            variant="bordered"
                                            value={link}
                                        />
                                    )}
                                </ModalBody>
                                <ModalFooter></ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    })
);

export default ShareLinkModal;
