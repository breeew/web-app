import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import PromptInputWithEnclosedActions from './prompt-input-with-enclosed-actions';

import { CreateChatSession } from '@/apis/chat';
import { Logo } from '@/components/icons';
import spaceStore from '@/stores/space';

export default function Chat() {
    const navigate = useNavigate();
    const { currentSelectedSpace } = useSnapshot(spaceStore);

    const onSubmit = useCallback<(msg: string) => Promise<void>>(
        async (message: string) => {
            if (!currentSelectedSpace) {
                throw new Error('uninited');
            }
            // create new session
            try {
                const sessionID = await CreateChatSession(currentSelectedSpace);

                navigate(`/dashboard/${currentSelectedSpace}/chat/session/${sessionID}?isNew=true`, {
                    state: {
                        messages: [
                            {
                                role: 'user',
                                message: message,
                                key: 1
                            }
                        ]
                    }
                });
            } catch (e: any) {
                throw e;
                console.error(e);
            }
        },
        [currentSelectedSpace]
    );

    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full h-full flex-col px-4 sm:max-w-[760px] justify-center">
                <div className="flex h-full flex-col items-center justify-center gap-10">
                    <div className="flex rounded-full items-center">
                        <Logo size={52} />
                    </div>
                    <div className="flex flex-col w-full">
                        <PromptInputWithEnclosedActions
                            classNames={{
                                button: 'bg-default-foreground opacity-100 w-[30px] h-[30px] !min-w-[30px] self-center',
                                buttonIcon: 'text-background',
                                input: 'placeholder:text-default-500'
                            }}
                            placeholder={t('chatToBrew')}
                            onSubmitFunc={onSubmit}
                        />
                        <p className="p-2 text-center text-small font-medium leading-5 text-default-500">{t('chatNotice')}</p>
                    </div>
                </div>
                <div className="mt-auto flex max-w-full flex-col gap-2" />
            </div>
        </div>
    );
}
