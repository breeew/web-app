import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Progress,
    ScrollShadow,
    Skeleton,
    useDisclosure
} from '@nextui-org/react';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'usehooks-ts';
import { useSnapshot } from 'valtio';

import { GetKnowledge, type Knowledge, ListKnowledge } from '@/apis/knowledge';
import CreateKnowledge from '@/components/create';
import GoTop from '@/components/go-top';
import KnowledgeEdit from '@/components/knowledge-edit';
import KnowledgeModal from '@/components/knowledge-modal';
import MainQuery from '@/components/main-query';
import Markdown from '@/components/markdown';
import { useMedia } from '@/hooks/use-media';
import { useUserAgent } from '@/hooks/use-user-agent';
import { FireTowerMsg } from '@/lib/firetower';
import resourceStore from '@/stores/resource';
import socketStore, { CONNECTION_OK } from '@/stores/socket';
import spaceStore from '@/stores/space';

export default function Component() {
    const { t } = useTranslation();
    const { isMobile } = useMedia();
    const { currentSelectedSpace } = useSnapshot(spaceStore);
    const { currentSelectedResource } = useSnapshot(resourceStore);
    const [page, setPage] = useState(1);
    const [pageSize, _] = useState(20);
    let [dataList, setDataList] = useState<Knowledge[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [knowledgeSearchKeywords, setKnowledgeSearchKeywords] = useState('');

    // load knowledge logic
    function initPage() {
        if (ssDom && ssDom.current) {
            ssDom.current.goToTop();
        }
        setPage(1);
        setHasMore(true);
    }

    async function loadData(page: number) {
        let _dataList: Knowledge[] = [];

        if (page !== 1 && dataList.length > 0) {
            _dataList = dataList;
        }
        setIsLoading(true);
        try {
            const resp = await ListKnowledge(currentSelectedSpace, knowledgeSearchKeywords, currentSelectedResource?.id, page, pageSize);

            setPage(page);
            if (resp.total <= page * pageSize) {
                setHasMore(false);
            }

            if (resp.list && _dataList.length > 0) {
                resp.list.forEach(v => {
                    _dataList.push(v);
                });
            } else {
                _dataList = resp.list || [];
            }
            setDataList(_dataList);
            setTotal(resp.total);
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    }

    const refreshDataList = useCallback(() => {
        initPage();

        loadData(1);
    }, [currentSelectedResource, currentSelectedSpace]);

    // reload on selected resource or space changed
    useEffect(() => {
        if (!currentSelectedResource || !currentSelectedSpace) {
            return;
        }
        refreshDataList();
    }, [currentSelectedResource, currentSelectedSpace]);

    const [onLoadingMore, setOnLoadingMore] = useState(false);

    async function onLoadMore() {
        if (!hasMore || onLoadingMore) {
            return;
        }
        setOnLoadingMore(true);
        await loadData(page + 1);
        setTimeout(() => {
            setOnLoadingMore(false);
        }, 500);
    }

    // show / edit / create knowledge detail
    // @ts-ignore
    const viewKnowledge = useRef(null);
    // @ts-ignore
    const createKnowledge = useRef<{ show: ({ space_id: string }) => void }>(null);
    const [knowledgeIsShow, setKnowledgeIsShow] = useState(false);

    const showKnowledge = useCallback(
        (knowledge: Knowledge) => {
            if (viewKnowledge && viewKnowledge.current) {
                // @ts-ignore
                viewKnowledge.current.show(knowledge);
                setKnowledgeIsShow(true);
            }
        },
        [viewKnowledge]
    );

    const showCreate = useCallback(() => {
        if (createKnowledge && createKnowledge.current) {
            createKnowledge.current.show({
                space_id: currentSelectedSpace
            });
            setKnowledgeIsShow(true);
        }
    }, [createKnowledge, currentSelectedSpace]);

    function onChanges() {
        refreshDataList();
    }

    const onDelete = useCallback(
        (knowledgeID: string) => {
            setDataList(dataList.filter(a => a.id !== knowledgeID));
        },
        [dataList]
    );

    // page key down event listener
    useEffect(() => {
        if (isMobile) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (knowledgeIsShow) {
                return;
            }
            // meta + b = create knowledge
            if (event.key === 'b' && event.metaKey) {
                showCreate();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobile, currentSelectedSpace]);

    //@ts-ignore
    const ssDom = useRef<{ goToTop: () => void }>();

    return (
        <>
            <div className="overflow-hidden w-full h-full flex flex-col relative p-3">
                <div className="space-y-1 mb-6">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold leading-9 text-default-foreground mb-4">{t('Your Memories')}</h1>
                        {isLoading && <Progress isIndeterminate size="sm" aria-label="Loading..." className="w-14" />}
                    </div>

                    <Skeleton isLoaded={total > 0 || !isLoading} className="max-w-64 rounded-lg">
                        <p className="text-small text-default-400">{t('memories count', { total: total, title: currentSelectedResource ? t(currentSelectedResource.title) : '' })}</p>
                    </Skeleton>
                </div>
                <KnowledgeList ref={ssDom} knowledgeList={dataList} onSelect={showKnowledge} onChanges={onChanges} onLoadMore={onLoadMore} />
                {isMobile || (
                    <div className="absolute w-auto bottom-2 right-1/2 mr-[-130px]">
                        <MainQuery onClick={showCreate} />
                    </div>
                )}
            </div>

            <KnowledgeModal
                ref={viewKnowledge}
                onChange={onChanges}
                onDelete={onDelete}
                onClose={() => {
                    setKnowledgeIsShow(false);
                }}
            />

            <CreateKnowledgeModal
                ref={createKnowledge}
                onChange={onChanges}
                onClose={() => {
                    setKnowledgeIsShow(false);
                }}
            />
        </>
    );
}

interface KnowledgeListProps {
    knowledgeList: Knowledge[];
    onSelect: (data: Knowledge) => void;
    onChanges: () => void;
    onLoadMore: () => void;
}

const KnowledgeList = memo(
    forwardRef(function KnowledgeList({ knowledgeList, onSelect, onChanges, onLoadMore }: KnowledgeListProps, ref: any) {
        const [dataList, setDataList] = useState(knowledgeList);
        const [onEvent, setEvent] = useState<FireTowerMsg | null>();
        const { currentSelectedSpace } = useSnapshot(spaceStore);
        const { subscribe, connectionStatus } = useSnapshot(socketStore);

        useEffect(() => {
            setDataList(knowledgeList);
        }, [knowledgeList]);

        useEffect(() => {
            if (connectionStatus !== CONNECTION_OK || currentSelectedSpace === '' || !subscribe) {
                return;
            }
            // data : {\"subject\":\"stage_changed\",\"version\":\"v1\",\"data\":{\"knowledge_id\":\"n9qU71qKbqhHak6weNrH7UpCzU4yNiBv\",\"stage\":\"Done\"}}"
            const unSubscribe = subscribe(['/knowledge/list/' + currentSelectedSpace], (msg: FireTowerMsg) => {
                if (msg.data.subject !== 'stage_changed') {
                    return;
                }

                setEvent(msg);
            });

            return unSubscribe;
        }, [connectionStatus, currentSelectedSpace]);

        useEffect(() => {
            if (!onEvent || !onEvent.data || onEvent.data.subject !== 'stage_changed') {
                return;
            }

            switch (onEvent.data.data.stage) {
                case 'Embedding':
                    const nextList = [...dataList];
                    const item = nextList.find(a => a.id === onEvent.data.data.knowledge_id);

                    if (item) {
                        item.stage = 2; // TODO const
                        setDataList(nextList);
                    }
                    break;
                case 'Done':
                    const doneLogic = async function () {
                        try {
                            const data = await GetKnowledge(currentSelectedSpace, onEvent.data.data.knowledge_id);
                            const newDataList = dataList.map(item => {
                                if (item.id === onEvent.data.data.knowledge_id) {
                                    return data;
                                }

                                return item;
                            });

                            setDataList(newDataList);
                        } catch (e: any) {
                            console.error(e);
                        }
                    };

                    doneLogic();
                    break;
                default:
                    console.log('unknown event', onEvent);
            }
            setEvent(null);
        }, [onEvent]);

        const ssDom = useRef<HTMLElement>(null);

        function goToTop() {
            if (ssDom) {
                // @ts-ignore
                ssDom.current.scrollTop = 0;
            }
        }

        // @ts-ignore
        useImperativeHandle(ref, () => {
            return {
                goToTop
            };
        });

        const [showGoTop, setShowGoTop] = useState(false);

        // @ts-ignore
        async function scrollChanged(e) {
            if (!showGoTop && e.target.scrollTop > 300) {
                setShowGoTop(true);
            } else if (showGoTop && e.target.scrollTop <= 300) {
                setShowGoTop(false);
            }

            if (e.target.scrollTop + e.target.clientHeight + 50 > e.target.scrollHeight) {
                onLoadMore();
            }
        }
        const { isSafari } = useUserAgent();

        return (
            <>
                <ScrollShadow ref={ssDom} hideScrollBar className="w-full flex-grow box-border mb-6 p-6" onScroll={scrollChanged}>
                    <div className={[isSafari ? 'm-auto w-full max-w-[900px]' : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 3xl:columns-5', 'gap-[24px]'].join(' ')}>
                        <div className="mb-[24px]">
                            <CreateKnowledge onChanges={onChanges} />
                        </div>
                        {dataList.map(item => {
                            return (
                                <div key={item.id} role="button" tabIndex={0} className="mb-[24px] relative" onClick={() => onSelect(item)} onKeyDown={() => {}}>
                                    <NormalCard content={item.content} tags={item.tags} title={item.title} stage={item.stage} />
                                </div>
                            );
                        })}
                    </div>
                </ScrollShadow>
                {showGoTop && <GoTop className="fixed bottom-6 right-6 backdrop-blur backdrop-saturate-150 dark:border-white/20 dark:bg-white/10 dark:text-white text-gray-500" onClick={goToTop} />}
            </>
        );
    })
);

interface CreateKnowledgeModalProps {
    onClose: () => void;
    onChange: () => void;
}

const CreateKnowledgeModal = memo(
    forwardRef((props: CreateKnowledgeModalProps, ref: any) => {
        const { t } = useTranslation();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [knowledge, setKnowledge] = useState<Knowledge>();
        const [size, setSize] = useState<Size>('md');
        const isMobile = useMediaQuery('(max-width: 768px)');

        const onChangeFunc = useCallback(() => {
            props.onChange && props.onChange();
            onCancelFunc();
        }, [props.onChange]);

        useEffect(() => {
            if (isMobile) {
                setSize('full');
            } else {
                // TODO maybe
                // setSize('3xl');
                setSize('full');
            }
        }, [isMobile]);

        function show(knowledge: Knowledge) {
            setKnowledge(knowledge);
            onOpen();
        }

        const { spaces } = useSnapshot(spaceStore);
        const spaceTitle = useMemo(() => {
            for (const item of spaces) {
                if (item.key === knowledge?.space_id) {
                    return item.title;
                }
            }

            return '';
        }, [spaces]);

        const onCancelFunc = useCallback(
            function () {
                props.onClose && props.onClose();
                onClose();
            },
            [props.onClose]
        );

        useImperativeHandle(ref, () => {
            return {
                show
            };
        });

        return (
            <>
                <Modal backdrop="blur" placement="bottom" scrollBehavior="inside" size={size} isOpen={isOpen} isKeyboardDismissDisabled={false} onClose={onCancelFunc}>
                    <ModalContent>
                        {onClose => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 dark:text-gray-100 text-gray-800">
                                    <Breadcrumbs>
                                        <BreadcrumbItem>Home</BreadcrumbItem>
                                        <BreadcrumbItem onClick={onClose}>{spaceTitle === 'Main' ? t('MainSpace') : spaceTitle}</BreadcrumbItem>
                                        <BreadcrumbItem>{t('Create')}</BreadcrumbItem>
                                    </Breadcrumbs>
                                </ModalHeader>
                                <ModalBody className="w-full overflow-hidden flex flex-col items-center">
                                    <KnowledgeEdit knowledge={knowledge} onChange={onChangeFunc} onCancel={onCancelFunc} />
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    })
);

CreateKnowledgeModal.displayName = 'createKnowledgeModal';

const NormalCard = memo(function NormalCard({ title, content, tags, stage }: { title: string; content: string; tags: string[] | undefined; stage: number }) {
    return (
        <>
            <Card
                className="w-full flex flex-col relative max-h-[460px] border-small border-foreground/10 bg-right-bottom bg-no-repeat
                hover:border-indigo-500/50 hover:outset-1 hover:outset-x-1 hover:outset-y-1 hover:blur-2.5 hover:spread-1 cursor-pointer"
            >
                {title !== '' ? (
                    <CardHeader>
                        <div className="flex items-center">
                            <p className="text-large font-medium dark:text-zinc-300 text-gray-800">{title}</p>
                        </div>
                    </CardHeader>
                ) : (
                    <></>
                )}
                <CardBody className="px-3 relative">
                    <div className="flex flex-col gap-2 px-1 w-full overflow-hidden">
                        {tags && (
                            <div className="flex flex-wrap gap-1">
                                {tags.map(item => {
                                    return (
                                        <Chip key={item} className="text-gray-600 dark:text-gray-300" size="sm" variant="bordered">
                                            {item}
                                        </Chip>
                                    );
                                })}
                            </div>
                        )}
                        <div className="text-base dark:text-white/60 text-gray-500 h-full overflow-ellipsis overflow-hidden line-clamp-6 text-wrap break-words">
                            <Markdown
                                isLight
                                urlTransform={() => {
                                    return '#';
                                }}
                            >
                                {content}
                            </Markdown>
                        </div>
                    </div>
                </CardBody>
                {(() => {
                    if (stage === 3) {
                        return <></>;
                    }

                    return (
                        <CardFooter className="justify-end gap-2">
                            <Button fullWidth className="border-small backdrop-blur backdrop-saturate-150 border-white/20 bg-white/10 dark:text-white" isLoading={true}>
                                <p className="text-tiny dark:text-white/80">{stage === 1 ? 'Summarizing.' : 'Embedding.'}</p>
                            </Button>
                        </CardFooter>
                    );
                })()}
            </Card>
        </>
    );
});
