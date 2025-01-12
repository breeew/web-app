import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ShareLinkModal from '@/components/share-link';

export interface ShareButtonProps {
    genUrlFunc: () => Promise<string>;
}

export default function ShareButton({ genUrlFunc }: ShareButtonProps) {
    const { t } = useTranslation();
    const [shareURL, setShareURL] = useState('');
    const [createShareLoading, setCreateShareLoading] = useState(false);
    const shareLink = useRef();
    const createShareURL = useCallback(async () => {
        setCreateShareLoading(true);
        try {
            const url = await genUrlFunc();
            if (url) {
                setShareURL(url);
                if (shareLink.current) {
                    shareLink.current.show(url);
                }
            }
            // const res = await CreateKnowledgeShareURL(knowledge?.space_id, window.location.origin + '/s/k/{token}', knowledge?.id);
        } catch (e: any) {
            console.error(e);
        }
        setCreateShareLoading(false);
    }, [genUrlFunc, shareLink]);

    return (
        <>
            <Button size="sm" variant="faded" endContent={<Icon icon="mingcute:share-3-line" />} isLoading={createShareLoading} onPress={createShareURL}>
                {t('Share')}
            </Button>
            <ShareLinkModal ref={shareLink} />
        </>
    );
}
