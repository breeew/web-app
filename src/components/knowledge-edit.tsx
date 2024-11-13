import { OutputData } from '@editorjs/editorjs';
import { Button, Input, ScrollShadow, Select, SelectItem, Spacer } from '@nextui-org/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { CreateKnowledge, type Knowledge, UpdateKnowledge } from '@/apis/knowledge';
import { Resource } from '@/apis/resource';
import { Editor } from '@/components/editor/index';
import { useToast } from '@/hooks/use-toast';
import resourceStore from '@/stores/resource';

export default memo(function KnowledgeEdit({ knowledge, onChange, onCancel }: { knowledge?: Knowledge; onChange?: () => void; onCancel?: () => void }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState(knowledge ? knowledge.title : '');
    const [content, setContent] = useState<string | OutputData>(knowledge ? knowledge.content : '');
    const [tags, setTags] = useState(knowledge ? knowledge.tags : []);
    const [isInvalid, setInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [resource, setResource] = useState(knowledge ? knowledge.resource : '');
    const { currentSpaceResources, currentSelectedResource } = useSnapshot(resourceStore);
    const resources = useMemo(() => {
        let list: Resource[] = [];
        let matched = false;

        if (currentSpaceResources) {
            for (const item of currentSpaceResources) {
                if (resource === item.id) {
                    matched = true;
                }

                if (item.id !== '') {
                    list.push(item);
                }
            }
        }

        if (!matched && resource) {
            list.push({
                id: resource,
                title: t('UnCreate') + ': ' + resource
            });
        }

        return list;
    }, [currentSpaceResources]);

    const defaultResource = useMemo(() => {
        if (currentSelectedResource && currentSelectedResource.id) {
            return currentSelectedResource.id;
        }

        if (resources.length > 0) {
            return resources[0].id;
        }

        return '';
    }, [currentSelectedResource, resources]);

    const onKnowledgeContentChanged = useCallback((value: string | OutputData) => {
        if (isInvalid) {
            setErrorMessage('');
            setInvalid(false);
        }
        setContent(value);
    }, []);

    const setStringTags = useCallback((strTags: string) => {
        setTags(strTags.split('|'));
    }, []);

    const { toast } = useToast();

    async function submit() {
        if (content === '') {
            setErrorMessage('knowledge content is empty');
            setInvalid(true);

            return;
        }

        if (!knowledge) {
            return;
        }

        setLoading(true);
        try {
            if (knowledge.id) {
                await UpdateKnowledge(knowledge.space_id, knowledge.id, {
                    resource: resource || defaultResource,
                    title: title,
                    content: content,
                    content_type: 'blocks',
                    tags: tags
                });
                toast({
                    title: t('Success'),
                    description: 'Updated knowledge ' + knowledge.id
                });
            } else {
                await CreateKnowledge(knowledge.space_id, resource || defaultResource, 'blocks', content);
                toast({
                    title: 'Success',
                    description: 'Create new knowledge'
                });
            }

            if (onChange) {
                onChange();
            }
        } catch (e: any) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <>
            {knowledge && (
                <ScrollShadow hideScrollBar className="w-full flex-grow box-border p-4 flex justify-center">
                    <div className="w-full h-full md:max-w-[650px]">
                        {knowledge.id && (
                            <>
                                <div className="w-full mt-10 mb-5 dark:text-gray-100 text-gray-800 text-lg overflow-hidden">
                                    <Input
                                        label={t('Title')}
                                        placeholder="Your knowledge title, empty to use ai genenrate"
                                        className="text-xl text-gray-800 dark:text-gray-100"
                                        labelPlacement="outside"
                                        defaultValue={knowledge.title}
                                        onValueChange={setTitle}
                                        classNames={{ label: 'text-white font-bold' }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1 mb-5">
                                    <Input
                                        label={t('Tags') + "(each tag splited with '|')"}
                                        placeholder="Your knowledge title, empty to use ai genenrate"
                                        className="text-xl text-gray-800 dark:text-gray-100"
                                        labelPlacement="outside"
                                        defaultValue={knowledge.tags ? knowledge.tags.join('|') : ''}
                                        onValueChange={setStringTags}
                                        classNames={{ label: 'text-white font-bold' }}
                                    />
                                </div>
                            </>
                        )}

                        <div className="w-full flex-wrap flex flex-col gap-3">
                            {defaultResource && (
                                <Select
                                    isRequired
                                    label={t('knowledgeCreateResourceLable')}
                                    defaultSelectedKeys={[defaultResource]}
                                    labelPlacement="outside"
                                    placeholder="Select an resource"
                                    className="text-xl text-gray-800 dark:text-gray-100"
                                    classNames={{ label: 'text-white font-bold' }}
                                    onSelectionChange={item => {
                                        if (item) {
                                            setResource(item.currentKey || '');
                                        }
                                    }}
                                >
                                    {resources.map(item => {
                                        return <SelectItem key={item.id}>{item.title}</SelectItem>;
                                    })}
                                </Select>
                            )}

                            <div className="w-full relative mt-2">
                                <Spacer y={2} />
                                <div className="text-small font-bold">{t('knowledgeCreateContentLabel')}</div>
                                <Spacer y={2} />
                                <Editor
                                    autofocus
                                    data={knowledge.content}
                                    dataType={knowledge.content_type}
                                    placeholder={t('knowledgeCreateContentLabelPlaceholder')}
                                    onValueChange={onKnowledgeContentChanged}
                                />
                                {/* <Textarea
                                    minRows={12}
                                    maxRows={100}
                                    name="knowledge"
                                    placeholder={t('knowledgeCreateContentLabelPlaceholder')}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    label={t('knowledgeCreateContentLabel')}
                                    isInvalid={isInvalid}
                                    errorMessage={errorMessage}
                                    defaultValue={knowledge.content}
                                    autoFocus={!knowledge.id}
                                    onValueChange={onKnowledgeContentChanged}
                                />
                                <div className="mt-1 flex w-full items-center justify-end gap-2 px-1">
                                    <Icon className="text-default-400 dark:text-default-300" icon="la:markdown" width={20} />
                                    <p className="text-tiny text-default-400 dark:text-default-300">
                                        <Link className="text-tiny text-default-500" color="foreground" href="https://guides.github.com/features/mastering-markdown/" rel="noreferrer" target="_blank">
                                            Markdown
                                            <Icon className="[&>path]:stroke-[2px]" icon="solar:arrow-right-up-linear" />
                                        </Link>
                                        &nbsp;supported.
                                    </p>
                                </div> */}
                            </div>

                            {/* <Input
                                label={t('knowledgeCreateResourceLable')}
                                variant="bordered"
                                placeholder={t('knowledgeCreateResourceLablePlaceholder')}
                                className="text-xl text-gray-800 dark:text-gray-100 !mt-12"
                                labelPlacement="outside"
                                defaultValue={knowledge.resource || 'knowledge'}
                                onValueChange={setResource}
                            /> */}
                        </div>

                        <div className="flex gap-4 justify-end">
                            {onCancel && (
                                <Button className="mt-6 float-right w-32 text-white bg-zinc-400 dark:bg-zinc-500" onClick={onCancel}>
                                    {t('Cancel')}
                                </Button>
                            )}

                            <Button
                                className="mt-6 float-right w-32 text-white bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                                isLoading={isLoading}
                                onClick={submit}
                            >
                                {t('Submit')}
                            </Button>
                        </div>
                        <div className="pb-20" />
                    </div>
                </ScrollShadow>
            )}
        </>
    );
});
