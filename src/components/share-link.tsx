import { Button, Checkbox, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

        const input = useRef();
        const copyLink = useCallback(() => {
            if (input.current) {
                input.current.select();
                document.execCommand('copy');
                toast.success(t('LinkCopied'));
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
