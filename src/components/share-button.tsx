import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { createContext, forwardRef, memo, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ShareContext = createContext(null);

export function ShareProvider({ children }) {
    const [shareURL, setShareURL] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <ShareContext.Provider
            value={{
                shareURL,
                setShareURL,
                isOpen,
                onOpen,
                onOpenChange
            }}
        >
            {children}
            <ShareLinkModal isOpen={isOpen} shareURL={shareURL} onOpenChange={onOpenChange} />
        </ShareContext.Provider>
    );
}

export interface ShareButtonProps {
    genUrlFunc: () => Promise<string>;
}

export default function ShareButton({ genUrlFunc }: ShareButtonProps) {
    const { t } = useTranslation();

    const { onOpen, setShareURL } = useContext(ShareContext);

    const [createShareLoading, setCreateShareLoading] = useState(false);
    const createShareURL = useCallback(async () => {
        setCreateShareLoading(true);
        try {
            const url = await genUrlFunc();
            if (url) {
                setShareURL(url);
                onOpen();
            }
            // const res = await CreateKnowledgeShareURL(knowledge?.space_id, window.location.origin + '/s/k/{token}', knowledge?.id);
        } catch (e: any) {
            console.error(e);
        }
        setCreateShareLoading(false);
    }, [genUrlFunc, onOpen, setShareURL]);

    return (
        <Button size="sm" variant="faded" endContent={<Icon icon="mingcute:share-3-line" />} isLoading={createShareLoading} onPress={createShareURL}>
            {t('Share')}
        </Button>
    );
}

export interface ShareLinkModalProps {
    isOpen: boolean;
    shareURL: string;
    onOpenChange: () => void;
}

const ShareLinkModal = memo(
    forwardRef(({ isOpen, onOpenChange, shareURL }: ShareLinkModalProps, ref: any) => {
        const { t } = useTranslation();

        const input = useRef();
        const copyLink = useCallback(() => {
            if (input.current) {
                input.current.select();
                document.execCommand('copy');
                toast.success(t('LinkCopied'));
            }
        }, [shareURL, input]);

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
                                    {shareURL && (
                                        <Input
                                            ref={input}
                                            endContent={
                                                <button onClick={copyLink}>
                                                    <Icon icon="tabler:copy" />
                                                </button>
                                            }
                                            readOnly
                                            variant="bordered"
                                            value={shareURL}
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
