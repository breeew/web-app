import { Accordion, AccordionItem, Avatar, Listbox, ListboxItem, ScrollShadow } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useSnapshot } from 'valtio';

import { GenChatMessageID, GetChatSessionHistory, GetMessageExt, MessageDetail, NamedChatSession, SendMessage } from '@/apis/chat';
import { Logo } from '@/components/icons';
import KnowledgeModal from '@/components/knowledge-modal';
import useUserAvatar from '@/hooks/use-user-avatar';
import { FireTowerMsg } from '@/lib/firetower';
import MessageCard, { type MessageExt } from '@/pages/dashboard/chat/message-card';
import PromptInputWithEnclosedActions from '@/pages/dashboard/chat/prompt-input-with-enclosed-actions';
import { notifySessionNamedEvent, notifySessionReload } from '@/stores/session';
import socketStore, { CONNECTION_OK } from '@/stores/socket';
import spaceStore from '@/stores/space';
import { EventType } from '@/types/chat';

interface Message {
    key: string;
    message: string;
    role: string;
    status: 'success' | 'failed' | 'continue' | undefined;
    sequence: number;
    spaceID: string;
    ext: MessageExt;
}

interface MessageEvent {
    type: number;
    message: string;
    messageID: string;
    spaceID?: string;
    sessionID?: string;
    startAt?: number;
    sequence?: number;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default function Chat() {
    const { t } = useTranslation();
    const [messages, setMessages] = useImmer<Message[]>([]);
    const [aiTyping, setAiTyping] = useState<boolean>(true);
    const { currentSelectedSpace } = useSnapshot(spaceStore);
    const userAvatar = useUserAvatar();
    const { sessionID } = useParams();
    const pageSize: number = 20;
    const [page, setPage] = useState<number>(1);
    // const [onEvent, setEvent] = useState<FireTowerMsg | null>();
    const { subscribe, connectionStatus } = useSnapshot(socketStore);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const ssDom = useRef<HTMLElement>(null);

    function goToBottom() {
        if (ssDom) {
            // @ts-ignore
            ssDom.current.scrollTop = 9999999;
        }
    }

    const loadMessageExt = useCallback(
        async (messageID: string) => {
            if (!currentSelectedSpace || !sessionID) {
                return;
            }
            try {
                const resp = await GetMessageExt(currentSelectedSpace, sessionID, messageID);

                setMessages((prev: Message[]) => {
                    const todo = prev.find(v => v.key === messageID);

                    if (todo) {
                        todo.ext = {
                            relDocs: resp.rel_docs
                        };
                    }
                });
            } catch (e: any) {
                console.error(e);
            }
        },
        [currentSelectedSpace, sessionID, messages]
    );

    useEffect(() => {
        let queue: MessageEvent[] = [];
        let onReload = false;
        const reloadFunc = async () => {
            onReload = true;
            await loadData(1);
            queue = [];
            onReload = false;
        };

        if (connectionStatus !== CONNECTION_OK || !sessionID || !subscribe) {
            if (messages.length > 0) {
                reloadFunc();
            }

            return;
        }

        const interval = () => {
            setTimeout(async () => {
                if (onReload) {
                    interval();

                    return;
                }
                while (true) {
                    const data = queue.shift();

                    if (!data || (data.type !== EventType.EVENT_ASSISTANT_INIT && messages.find(v => v.key === data.messageID))) {
                        data && queue.unshift(data);
                        break;
                    }

                    switch (data.type) {
                        case EventType.EVENT_ASSISTANT_INIT:
                            if (messages.find(v => v.key === data.messageID)) {
                                break;
                            }
                            setAiTyping(false);
                            setMessages((prev: Message[]) => {
                                prev.push({
                                    key: data.messageID,
                                    spaceID: data.spaceID || currentSelectedSpace,
                                    message: '',
                                    role: 'assistant',
                                    status: 'continue',
                                    sequence: data.sequence || 0,
                                    ext: {}
                                });
                            });

                            break;
                        case EventType.EVENT_ASSISTANT_CONTINUE:
                            let index = 0;

                            for (let i = 0; i < data.message.length; i += 2) {
                                setMessages((prev: Message[]) => {
                                    if (index === 0) {
                                        index = prev.findIndex(todo => todo.key === data.messageID);
                                    }
                                    const todo = prev[index];

                                    if (!todo || todo.message.length !== data.startAt) {
                                        return;
                                    }

                                    let char = data.message.substr(i, 2); // append two words at once

                                    todo.message += char;
                                    data.startAt += char.length;
                                });

                                if (i % 26 === 0) {
                                    goToBottom();
                                }

                                await delay(30);
                            }

                            break;
                        case EventType.EVENT_ASSISTANT_DONE:
                            setMessages((prev: Message[]) => {
                                const todo = prev.find(todo => todo.key === data.messageID);

                                if (!todo || todo.message.length !== data.startAt) {
                                    console.warn('reload history');
                                    reloadFunc();
                                } else {
                                    todo.status = 'success';
                                    loadMessageExt(data.messageID);
                                }
                            });
                            // todo load this message exts
                            break;
                        case EventType.EVENT_ASSISTANT_FAILED:
                            setMessages((prev: Message[]) => {
                                const todo = prev.find(todo => todo.key === data.messageID);

                                if (todo) {
                                    todo.status = 'failed';
                                }
                            });
                            break;
                        default:
                    }
                    goToBottom();
                }
                interval();
            }, 200);
        };

        setTimeout(() => {
            interval();
        });

        // data : {\"subject\":\"stage_changed\",\"version\":\"v1\",\"data\":{\"knowledge_id\":\"n9qU71qKbqhHak6weNrH7UpCzU4yNiBv\",\"stage\":\"Done\"}}"
        const unSubscribe = subscribe(['/chat_session/' + sessionID], (msg: FireTowerMsg) => {
            if (msg.data.subject !== 'on_message' && msg.data.subject !== 'on_message_init') {
                return;
            }

            const { type, data } = msg.data;

            switch (type) {
                case EventType.EVENT_ASSISTANT_INIT:
                    queue.push({
                        messageID: data.message_id,
                        type: EventType.EVENT_ASSISTANT_INIT,
                        startAt: 0,
                        sequence: data.sequence,
                        spaceID: data.space_id,
                        sessionID: data.session_id,
                        message: ''
                    });
                    // setMessages((prev: Message[]): Message[] => {
                    //     prev.push({
                    //         key: data.message_id,
                    //         message: '',
                    //         role: 'assistant',
                    //         status: 'continue',
                    //         sequence: data.sequence,
                    //         loading: true
                    //     });
                    // });
                    break;
                case EventType.EVENT_ASSISTANT_CONTINUE:
                    queue.push({
                        messageID: data.message_id,
                        type: EventType.EVENT_ASSISTANT_CONTINUE,
                        startAt: data.start_at,
                        message: data.message
                    });
                    // setMessages((prev: Message[]) => {
                    //     const todo = prev.find(todo => todo.key === data.message_id);
                    //     if (!todo) {
                    //     }
                    //     if (todo?.message.length !== data.start_at) {
                    //         console.warn('reload history');
                    //     }
                    //     todo.message += data.message;
                    // });
                    break;
                case EventType.EVENT_ASSISTANT_DONE:
                    queue.push({
                        messageID: data.message_id,
                        type: EventType.EVENT_ASSISTANT_DONE,
                        startAt: data.start_at,
                        message: ''
                    });
                    // setMessages((prev: Message[]) => {
                    //     const todo = prev.find(todo => todo.key === data.message_id);

                    //     if (todo?.message.length !== data.start_at) {
                    //         console.warn('reload history');
                    //     } else {
                    //         todo.status = 'success';
                    //     }
                    // });
                    // todo load this message exts
                    break;
                case EventType.EVENT_ASSISTANT_FAILED:
                    queue.push({
                        messageID: data.message_id,
                        type: EventType.EVENT_ASSISTANT_FAILED,
                        startAt: 0,
                        message: ''
                    });
                    // setMessages((prev: Message[]) => {
                    //     const todo = prev.find(todo => todo.key === data.message_id);

                    //     todo.status = 'failed';
                    // });
                    break;
            }
        });

        return unSubscribe;
    }, [connectionStatus, sessionID]);

    const loadData = useCallback(
        async (page: number): Promise<number | void> => {
            if (!currentSelectedSpace || (!hasMore && page !== 1) || !sessionID) {
                return;
            }
            try {
                const resp = await GetChatSessionHistory(currentSelectedSpace, sessionID, '', page, pageSize);

                setPage(page);
                if (page * pageSize >= resp.total) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                const newMsgs =
                    resp.list &&
                    resp.list.map((v: MessageDetail): Message => {
                        return {
                            key: v.meta.message_id,
                            message: v.meta.message.text,
                            role: v.meta.role === 1 ? 'user' : 'assistant',
                            status: 'success',
                            sequence: v.meta.sequence,
                            spaceID: currentSelectedSpace,
                            ext: {
                                relDocs: v.ext?.rel_docs
                            }
                        };
                    });

                if (page === 1) {
                    setMessages(newMsgs || []);
                } else if (resp.list) {
                    setMessages([...newMsgs, ...messages]);
                }

                setTimeout(() => {
                    goToBottom();
                }, 500);

                return resp.total;
            } catch (e: any) {
                console.error(e);
            }
        },
        [currentSelectedSpace, sessionID, hasMore]
    );

    const location = useLocation();
    const urlParams = new URLSearchParams(window.location.search);
    const isNew = urlParams.get('isNew');

    const query = useCallback(
        async (message: string) => {
            if (!currentSelectedSpace || !sessionID) {
                return;
            }

            try {
                const msgID = await GenChatMessageID(currentSelectedSpace, sessionID);
                const resp = await SendMessage(currentSelectedSpace, sessionID, {
                    messageID: msgID,
                    message: message
                });

                setMessages((prev: Message[]) => {
                    prev.push({
                        key: msgID,
                        message: message,
                        role: 'user',
                        status: 'success',
                        sequence: resp.sequence,
                        spaceID: currentSelectedSpace,
                        ext: {}
                    });
                });

                // waiting ws response
                setAiTyping(true);

                sessionID && notifySessionReload(sessionID);

                setTimeout(() => {
                    goToBottom();
                }, 500);
            } catch (e: any) {
                console.error(e);
                throw e;
            }
        },
        [currentSelectedSpace, messages]
    );

    async function NamedSession(firstMessage: string) {
        if (!sessionID) {
            return;
        }
        try {
            const resp = await NamedChatSession(currentSelectedSpace, sessionID, firstMessage);

            notifySessionNamedEvent({
                sessionID: resp.session_id,
                name: resp.name
            });
        } catch (e: any) {
            console.error(e);
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            setMessages([]);
            setAiTyping(true);
            const total = await loadData(1);

            if (isNew && total === 0) {
                if (location.state && location.state.messages && location.state.messages.length === 1) {
                    NamedSession(location.state.messages[0].message);
                    await query(location.state.messages[0].message);
                    location.state.messages = undefined;
                }
            } else {
                setAiTyping(false);
            }
        }
        if (currentSelectedSpace) {
            if (!sessionID || (messages && messages.length > 0 && messages[0].spaceID !== currentSelectedSpace)) {
                navigate(`/dashboard/${currentSelectedSpace}/chat`);

                return;
            }
            load();
        }
    }, [currentSelectedSpace, sessionID]);

    const viewKnowledge = useRef(null);

    const showKnowledge = useCallback(
        (knowledgeID: string) => {
            if (viewKnowledge && viewKnowledge.current) {
                // @ts-ignore
                viewKnowledge.current.show(knowledgeID);
            }
        },
        [viewKnowledge]
    );

    return (
        <>
            <div className="overflow-hidden w-full h-full flex flex-col relative p-3 items-center">
                <main className="h-full max-w-[760px] w-full relative gap-4 py-3 flex flex-col">
                    <div className="flex overflow-hidden">
                        <ScrollShadow ref={ssDom} hideScrollBar className="py-6 flex-grow">
                            <div className="w-full overflow-hidden relative flex flex-col gap-6">
                                {messages.map(({ key, role, message, status, ext }) => (
                                    <MessageCard
                                        key={key}
                                        avatar={role === 'assistant' ? <Logo /> : <Avatar src={userAvatar} />}
                                        message={message}
                                        messageClassName={role === 'user' ? 'bg-content3 text-content3-foreground' : ''}
                                        // showFeedback={role === 'assistant'}
                                        status={status}
                                        ext={ext}
                                        role={role}
                                        extContent={
                                            role === 'assistant' &&
                                            ext &&
                                            ext.relDocs && (
                                                <div className="mx-2 w-auto overflow-hidden">
                                                    <Accordion isCompact variant="bordered">
                                                        <AccordionItem
                                                            key="1"
                                                            aria-label="Relevance Detail"
                                                            title={t('showRelevanceDocs')}
                                                            classNames={{ title: 'dark:text-zinc-300 text-zinc-500 text-sm' }}
                                                            className="overflow-hidden w-ful"
                                                        >
                                                            {ext.relDocs && (
                                                                <Listbox
                                                                    aria-label="rel docs"
                                                                    title="docs id"
                                                                    onAction={key => {
                                                                        showKnowledge(key as string);
                                                                    }}
                                                                >
                                                                    {ext.relDocs.map(v => {
                                                                        return (
                                                                            <ListboxItem
                                                                                key={v.id}
                                                                                aria-label={v.title}
                                                                                className="overflow-hidden text-wrap break-words break-all flex flex-col items-start"
                                                                            >
                                                                                {v.title && <div>{v.title}</div>}
                                                                                <div> {v.id}</div>
                                                                            </ListboxItem>
                                                                        );
                                                                    })}
                                                                </Listbox>
                                                            )}
                                                        </AccordionItem>
                                                    </Accordion>
                                                </div>
                                            )
                                        }
                                    />
                                ))}
                                {aiTyping && <MessageCard key="aiTyping" isLoading attempts={1} currentAttempt={1} message={''} />}
                            </div>
                            <div className="pb-40" />
                        </ScrollShadow>
                    </div>
                    <div className="mt-auto flex max-w-full flex-col gap-2">
                        <PromptInputWithEnclosedActions
                            classNames={{
                                button: 'bg-default-foreground opacity-100 w-[30px] h-[30px] !min-w-[30px] self-center',
                                buttonIcon: 'text-background',
                                input: 'placeholder:text-default-500'
                            }}
                            placeholder={t('chatToBrew')}
                            onSubmitFunc={query}
                        />
                        <p className="p-2 text-center text-small font-medium leading-5 text-default-500">{t('chatNotice')}</p>
                    </div>
                </main>
            </div>
            <KnowledgeModal ref={viewKnowledge} />
        </>
    );
}
