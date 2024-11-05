import { Icon } from '@iconify/react';
import { Button, Card, CardBody, CardFooter, type CardProps, cn, Divider, Link, Select, SelectItem, Textarea } from '@nextui-org/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { CreateKnowledge } from '@/apis/knowledge';
import resourceStore from '@/stores/resource';
import spaceStore from '@/stores/space';

export default memo(function Component(props: CardProps & { onChanges: () => void }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [knowledge, setKnowledge] = useState<string>('');

    const [isInvalid, setInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { currentSpaceResources, currentSelectedResource } = useSnapshot(resourceStore);
    const resources = useMemo(() => {
        let list = [];

        if (currentSpaceResources) {
            for (const item of currentSpaceResources) {
                if (item.id !== '') {
                    list.push(item);
                }
            }
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
    }, [resources, currentSelectedResource]);
    const [resource, setResource] = useState('');

    const onKnowledgeContentChanged = useCallback((value: string) => {
        if (isInvalid) {
            setErrorMessage('');
            setInvalid(false);
        }
        setKnowledge(value);
    }, []);

    async function createNewKnowledge() {
        if (knowledge === '') {
            setErrorMessage('knowledge content is empty');
            setInvalid(true);

            return;
        }
        if (spaceStore.currentSelectedSpace === '') {
            setErrorMessage('space error, try refresh browser');
            setInvalid(true);

            return;
        }

        setLoading(true);
        try {
            await CreateKnowledge(spaceStore.currentSelectedSpace, resource || defaultResource, knowledge);

            if (props.onChanges) {
                props.onChanges();
            }
            setIsOpen(false);
        } catch (e: any) {
            console.error(e);
        }
        setLoading(false);
    }

    const content = isOpen ? (
        <div className="h-full w-full items-start justify-center box-border overflow-scroll pb-10 pt-10">
            <div className="flex flex-col gap-2">
                <form className="flex w-full flex-col gap-2">
                    <div className="mt-1 flex w-full items-center justify-end gap-2 px-1">
                        <p className="text-tiny text-default-400 dark:text-default-300">{t('One thing, One memory')}</p>
                    </div>
                    <Textarea
                        minRows={8}
                        name="knowledge"
                        placeholder="Ideas or knowledges to create new memory"
                        variant="faded"
                        isInvalid={isInvalid}
                        errorMessage={errorMessage}
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
                    </div>
                    {defaultResource && (
                        <Select
                            isRequired
                            variant="faded"
                            label={t('knowledgeCreateResourceLable')}
                            defaultSelectedKeys={[defaultResource]}
                            labelPlacement="outside"
                            placeholder="Select an resource"
                            className="max-w-xs"
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
                    <Button className="mt-1 text-white bg-gradient-to-br from-pink-300 from-15%  to-indigo-600 dark:from-indigo-500 dark:to-pink-500" isLoading={loading} onClick={createNewKnowledge}>
                        {t('Submit')}
                    </Button>
                </form>
            </div>
            <Divider className="mb-8 mt-10" />
            <ul className="flex flex-col gap-1">
                <li>
                    <span className="text-default-400">{t('One thing, One memory')}</span>
                </li>
            </ul>
        </div>
    ) : (
        <ul>
            <li className="flex items-center gap-1">
                <Icon className="text-default-600" icon="ci:check" width={24} />
                <p className="text-small text-default-500">{t('createCardTag1')}</p>
            </li>
            <li className="flex items-center gap-1">
                <Icon className="text-default-600" icon="ci:check" width={24} />
                <p className="text-small text-default-500">{t('createCardTag2')}</p>
            </li>
        </ul>
    );

    return (
        <Card {...props} className="relative w-full pb-[100px] border dark:border-none">
            {isOpen ? (
                <Button className="absolute right-4 top-4 z-10" isIconOnly={isOpen} radius="full" size="sm" onPress={() => setIsOpen(prev => !prev)}>
                    <Icon icon="ci:close-sm" width={24} />
                </Button>
            ) : (
                <Button
                    className="absolute right-4 top-4 z-10 text-white bg-gradient-to-br from-pink-300 from-45%  to-indigo-600 dark:from-indigo-500 dark:to-pink-500"
                    isIconOnly={isOpen}
                    radius="full"
                    size="sm"
                    onPress={() => setIsOpen(prev => !prev)}
                >
                    {t('Create')}
                </Button>
            )}
            <CardBody className="relative min-h-[300px] bg-gradient-to-br from-content1 to-default-100/50 p-8 before:inset-0 before:h-full before:w-full before:content-['']">
                <h1 className="mb-4 text-default-400 top-[-12px] relative">{t('quick to')}</h1>
                <h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
                    New
                    <br />
                    Memory
                    <br />
                    Create
                </h2>
            </CardBody>
            <CardFooter
                className={cn('absolute bottom-0 h-[100px] overflow-visible bg-content1 px-6 duration-300 ease-in-out transition-height', {
                    'h-full': isOpen,
                    'border-t-1 border-default-100': !isOpen
                })}
            >
                {content}
            </CardFooter>
        </Card>
    );
});
