import { Button, Card, CardHeader, Code, Image, Input, Link, Select, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSnapshot } from 'valtio';

import { CreateFileChunkTask } from '@/apis/chunk-task';
import { CreateKnowledge } from '@/apis/knowledge';
import { usePlan } from '@/hooks/use-plan';
import knowledge from '@/pages/share/knowledge';
import resourceStore from '@/stores/resource';

export interface WorkBarProps {
    spaceid: string;
    onSubmit?: () => void;
}

const WorkBar = memo(function WorkBar({ spaceid, onSubmit }: WorkBarProps) {
    const { t } = useTranslation();

    const { currentSelectedResource } = useSnapshot(resourceStore);
    const { userIsPro } = usePlan();

    const createToResource = useMemo(() => {
        if (currentSelectedResource && currentSelectedResource.id !== '') {
            return {
                id: currentSelectedResource.id,
                title: currentSelectedResource.title
            };
        }
        return {
            id: 'knowledge',
            title: t('resourceKnowledge')
        };
    }, [currentSelectedResource]);

    const [knowledgeContent, setKnowledgeContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const createKnowledge = useCallback(async () => {
        if (!userIsPro) {
            // TODO alert upgrade plan
            return;
        }
        if (knowledgeContent === '') {
            toast.error(t('Error'), {
                description: 'Knowledge content is empty'
            });

            return;
        }

        setIsLoading(true);
        try {
            await CreateKnowledge(spaceid, currentSelectedResource?.id, knowledgeContent, 'markdown');
            setKnowledgeContent('');
            toast.success(t('Success'));
            if (onSubmit) {
                onSubmit();
            }
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    }, [knowledgeContent, currentSelectedResource, userIsPro]);

    return (
        <div className="w-full flex flex-col gap-2 py-6 ">
            <div className="flex md:flex-row flex-col px-6 mb-2 w-full  items-center gap-4">
                <div className="text-2xl font-bold leading-9 text-default-foreground">🤯 工作区</div>
                <Code className="text-sm text-default-500">当前工作区提交的资源类型为：{createToResource.title}</Code>
            </div>
            <div className="flex lg:flex-row flex-col flex-wrap gap-4 px-6">
                <div className="flex flex-col lg:w-1/2 w-full h-[200px]">
                    <Textarea
                        variant="bordered"
                        placeholder="Type your new knowledge here."
                        onValueChange={setKnowledgeContent}
                        value={knowledgeContent}
                        startContent={
                            <>
                                {!knowledgeContent && (
                                    <div className="absolute bottom-2 left-2 flex gap-2">
                                        <Input variant="faded" className="w-full" size="sm" placeholder="from url" />
                                        <Button variant="faded" size="sm">
                                            {t('Submit')}
                                        </Button>
                                    </div>
                                )}
                            </>
                        }
                        endContent={
                            <>
                                {knowledgeContent && (
                                    <div className="absolute bottom-2 right-2">
                                        <Button variant="faded" size="sm" isLoading={isLoading} onPress={createKnowledge}>
                                            {t('Submit')}
                                        </Button>
                                    </div>
                                )}
                            </>
                        }
                        minRows={8}
                    />
                    <div className="flex w-full items-center justify-end gap-2 p-1">
                        <Icon className="text-default-400 dark:text-default-300" icon="la:markdown" width={20} />
                        <p className="text-tiny text-default-400 dark:text-default-300">
                            <Link className="text-tiny text-default-500" color="foreground" href="https://guides.github.com/features/mastering-markdown/" rel="noreferrer" target="_blank">
                                Markdown
                                <Icon className="[&>path]:stroke-[2px]" icon="solar:arrow-right-up-linear" />
                            </Link>
                            &nbsp;supported.
                        </p>
                    </div>
                </div>
                <div className="w-full flex-1 ">
                    <Card className="h-[180px] cursor-pointer">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-tiny text-white/60 uppercase font-bold">Rich Text</p>
                            <h4 className="text-white font-medium text-large">富文本编辑</h4>
                        </CardHeader>
                        <Image removeWrapper alt="Card background" className="z-0 w-full h-full object-cover" src="https://heroui.com/images/card-example-2.jpeg" />
                    </Card>
                </div>
            </div>
        </div>
    );
});

export default WorkBar;

const FileTask = memo(() => {
    const { t } = useTranslation();
    function init() {
        setChunkFile({});
        setFileMeta('');
        setResource('');
    }

    const [chunkFile, setChunkFile] = useState<{ name: string; url: string; file: File }>({});
    async function createChunkTask() {
        if (!userIsPro) {
            // TODO alert upgrade plan
            return;
        }
        if (chunkFile.url !== '') {
            setLoading(true);
            try {
                await CreateFileChunkTask(currentSelectedSpace, fileMeta, resource || defaultResource, chunkFile.name, chunkFile.url);
                toast.success(t('fileMemoryTaskCreated'));
                init();
            } catch (e: any) {
                console.error(e);
            }
            setLoading(false);
            return;
        }
    }

    const { uploader } = useUploader();

    const navigate = useNavigate();
    const { isMobile } = useMedia();
    const [isShowTaskList, setIsShowTaskList] = useState(false);
    const { userIsPro, isPlatform } = usePlan();

    if (!isPlatform) {
        return <></>;
    }

    return (
        <>
            {!chunkFile.url ? (
                <FileUploader
                    className="border-zinc-600"
                    accept={{
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                        'application/pdf': []
                    }}
                    onValueChange={e => {
                        console.log(e);
                    }}
                    onUpload={async f => {
                        if (f.length === 0) {
                            return;
                        }
                        const resp = await uploader(currentSelectedSpace, f[0], 'knowledge', 'chunk');
                        if (resp.success) {
                            setChunkFile({
                                name: resp.file?.name,
                                url: resp.file?.url,
                                file: f[0]
                            });
                        }
                    }}
                    disabled={!userIsPro}
                />
            ) : (
                <>
                    <span className="text-white my-2">{t('AIAutoChunkDescription')}</span>
                    <FilePreview
                        file={chunkFile.file}
                        onRemove={() => {
                            setChunkFile({});
                        }}
                    />
                </>
            )}
        </>
    );
});
