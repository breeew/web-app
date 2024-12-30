import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { Icon } from '@iconify/react';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import type { CalendarDate, Selection } from '@nextui-org/react';
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    CheckboxGroup,
    cn,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Progress,
    ScrollShadow,
    select,
    Select,
    SelectItem,
    SelectSection,
    Slider,
    Textarea
} from '@nextui-org/react';
import { Calendar } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { GetJournal, Journal, UpsertJournal } from '@/apis/journal';
import KnowledgeAITaskList from '@/components/ai-tasks-list';
import { Editor } from '@/components/editor/index';
import KnowledgeDrawer from '@/components/knowledge-drawer';
import { toast } from '@/hooks/use-toast';
import spaceStore, { setCurrentSelectedSpace } from '@/stores/space';

export interface TodoList {
    title: string;
    list: TodoListItem[];
}
export interface TodoListItem {
    id: string;
    index: number[];
    checked: boolean;
    content: string;
    items: TodoListItem[];
}

export interface EditorCheckListItem {
    content: string;
    items: EditorCheckListItem[];
    meta: {
        checked: boolean;
    };
}

function parserCheckList(id: string, index: number[], data: EditorCheckListItem): TodoListItem {
    let todoItem: TodoListItem = {
        id: id,
        index: index,
        checked: data.meta.checked,
        content: data.content,
        items: []
    };
    if (!data.items) {
        return todoItem;
    }

    for (const i in data.items) {
        const indexCopy = [...index];
        indexCopy.push(i);
        todoItem.items.push(parserCheckList(id, indexCopy, data.items[i]));
    }

    return todoItem;
}

function parseDateParamsToDate(dateStr: string) {
    const res = dateStr.split('-');
    return {
        year: Number(res[0]),
        month: Number(res[1]),
        day: Number(res[2])
    };
}

export default function Component() {
    const { t } = useTranslation();
    const { selectDate, spaceID } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState<Journal>({});
    const [blocks, setBlocks] = useState<OutputData>();
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [currentSelectedDate, setCurrentSelectedDate] = useState<CalendarDate>(parseDate(selectDate));

    const currentDate = useMemo(() => {}, [selectDate]);
    const haveNextDay = useMemo(() => {
        const t = today(getLocalTimeZone());
        if (t.year !== currentSelectedDate.year) {
            return t.year > currentSelectedDate.year; // 比较年份
        }
        if (t.month !== currentSelectedDate.month) {
            return t.month > currentSelectedDate.month; // 比较月份
        }
        return t.day > currentSelectedDate.day; // 比较日期
    }, [currentSelectedDate]);

    const { spaces, currentSelectedSpace } = useSnapshot(spaceStore);
    const currentSpace = useMemo(() => {
        return spaces.find(v => v.space_id === spaceID);
    }, [spaceID, spaces]);

    async function loadData(spaceID: string, selectDate: string) {
        setIsLoading(true);
        try {
            const journal = await GetJournal(spaceID, selectDate);
            if (journal && journal.content) {
                onBlocksChanged(journal.content, false);
                setJournal(journal);
                if (editor.current) {
                    editor.current.reRender(journal.content);
                }
            } else {
                onBlocksChanged({ blocks: [] }, false);
            }
        } catch (e: any) {
            console.error('get date journal error', e);
            toast({
                title: t('Error'),
                description: t('Please retry')
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (!currentSpace) {
            return;
        }
        if (!currentSelectedSpace) {
            setCurrentSelectedSpace(currentSpace.space_id);
        }

        if (editor.current) {
            editor.current.reRender({ blocks: [] });
            setJournal({});
        }

        loadData(currentSpace.space_id, selectDate);
    }, [currentSpace, selectDate]);

    const [journalTodos, setJournalTodos] = useState<TodoList[]>([]);

    const onBlocksChanged = useCallback(
        (blocks: OutputData, needToUpdate = true) => {
            setBlocks(blocks);
            if (!blocks.blocks) {
                return;
            }

            if (needToUpdate) {
                setIsUpdating(true);
                UpsertJournal(currentSelectedSpace, selectDate, blocks)
                    .then(res => {
                        if (!journal) {
                            GetJournal(currentSelectedSpace, selectDate);
                        }
                    })
                    .catch(e => {
                        console.error('upert journal error', e);
                        toast({
                            title: t('Error'),
                            description: t('Please retry')
                        });
                    })
                    .finally(e => {
                        setIsUpdating(false);
                    });
            }

            // patch todo list
            let todos: TodoList[] = [];
            let previousBlock: OutputBlockData = {};
            let isConsecutive = false;
            for (const item of blocks.blocks) {
                if (item.type === 'listv2' && item.data.style === 'checklist') {
                    if (!isConsecutive) {
                        // 如果不是连续的checklist，则新增一个todo组
                        let title = '';
                        if (previousBlock && previousBlock.type === 'header') {
                            title = previousBlock.data.text;
                        }
                        todos.push({
                            title: title,
                            list: []
                        });
                    }
                    for (const i in item.data.items) {
                        if (item.data.items[i]) {
                            todos[todos.length - 1].list.push(parserCheckList(item.id, [i], item.data.items[i]));
                        }
                    }

                    isConsecutive = true;
                } else {
                    isConsecutive = false;
                }
                if (item.type === 'header') {
                    previousBlock = item;
                }
            }
            setJournalTodos(todos);
        },
        [selectDate, currentSelectedSpace]
    );

    // 通过date跳转
    const redirectTo = useCallback((date: CalendarDate) => {
        const t = date.toString();
        setCurrentSelectedDate(date);
        navigate(`/dashboard/${spaceID}/journal/${t}`);
    }, []);

    // 通过天数加减来跳转
    const redirectToNumber = useCallback(
        (n: number) => {
            redirectTo(
                currentSelectedDate.add({
                    days: n
                })
            );
        },
        [currentSelectedDate]
    );

    const controlsContent = useMemo(
        () => (
            <div className="flex flex-col gap-6">
                <div className="mx-auto relative">
                    <Calendar
                        aria-label="Date (Max Date Value)"
                        value={currentSelectedDate}
                        minValue={today(getLocalTimeZone()).add({ days: -31 })}
                        maxValue={today(getLocalTimeZone())}
                        onChange={v => {
                            redirectTo(v);
                        }}
                        classNames={{ base: '!bg-content2 shadow-none border-none mx-auto !block', headerWrapper: 'bg-content2', gridWrapper: 'bg-content2', gridHeader: 'bg-content2 shadow-none' }}
                    />
                    <div className="mt-2 flex w-full flex-col gap-2 px-4 overflow-hidden text-wrap break-words">
                        {journalTodos.length > 0 && <div className="pb-2 text-zinc-500 text-sm">{t('Journal Todos')}</div>}
                        {journalTodos.map(v => {
                            return (
                                <>
                                    <h1>{v.title.replace(/&nbsp;/gi, '').trim()}</h1>
                                    <div className="journal__todo">{renderTodoListItem(false, v.list)}</div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        ),
        [journalTodos]
    );

    const editor = useRef();

    function onJournalTodoChanged(data: OutputData, targetId: string, index: number[]) {
        const block = data.blocks.find(block => block.id === targetId);
        if (!block) {
            console.error('Target block not found.');
            return;
        }

        let currentItem = block.data.items;

        for (let i = 0; i < index.length; i++) {
            if (!currentItem || !currentItem[index[i]]) {
                console.error('Invalid index path.');
                return;
            }
            if (index.length === i + 1) {
                currentItem = currentItem[index[i]];
            } else {
                currentItem = currentItem[index[i]].items;
            }
        }

        const targetItem = currentItem;
        if (targetItem && targetItem.meta) {
            targetItem.meta.checked = !targetItem.meta.checked;
        } else {
            console.error('Target item not found or missing meta.');
        }

        onBlocksChanged(data);
        if (editor.current) {
            editor.current.update(block.id, block.data);
        }
    }

    function renderTodoListItem(isChild: boolean, list: TodoListItem[]) {
        if (!list || list.length === 0) {
            return;
        }
        return (
            <ul key={'todo_title_' + list[0].content}>
                {list.map(v => {
                    return (
                        <>
                            <li key={v.content} className="cdx-list__item">
                                <Checkbox
                                    key={v.content}
                                    value={v.content}
                                    isSelected={v.checked}
                                    radius="sm"
                                    onChange={e => {
                                        onJournalTodoChanged(blocks, v.id, v.index);
                                    }}
                                >
                                    {v.content}
                                </Checkbox>
                            </li>
                            {v.items && renderTodoListItem(true, v.items)}
                        </>
                    );
                })}
            </ul>
        );
    }

    const editorRender = useMemo(() => {
        return <>{isLoading || <Editor ref={editor} autofocus data={blocks} dataType="blocks" placeholder={t('knowledgeCreateContentLabelPlaceholder')} onValueChange={onBlocksChanged} />}</>;
    }, [isLoading]);

    return (
        <section className="h-screen flex flex-col w-full p-4 overflow-hidden items-center bg-content2">
            <KnowledgeAITaskList />
            <header className="flex w-full flex-col items-center gap-2 sm:gap-4 pb-4 lg:flex-row lg:justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="">
                        <Breadcrumbs size="lg">
                            <BreadcrumbItem
                                onPress={() => {
                                    navigate('/dashboard');
                                }}
                            >
                                {currentSpace?.title}
                            </BreadcrumbItem>
                            <BreadcrumbItem>{t('Journal')}</BreadcrumbItem>
                        </Breadcrumbs>
                    </h1>
                    <Popover>
                        <PopoverTrigger>
                            <Button isIconOnly className="flex lg:hidden" radius="full" size="sm" variant="flat">
                                <Icon icon="solar:menu-dots-bold" width={24} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="fle-col flex max-h-[40vh] w-[300px] justify-start gap-3 overflow-scroll p-4">{controlsContent}</PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center gap-2">
                    {(isUpdating || isLoading) && <Progress isIndeterminate size="sm" aria-label="Loading..." className="w-14" />} <KnowledgeDrawer temporaryStorage="journal-knowledge" />
                </div>
            </header>

            <main className="flex gap-6 w-full max-w-[1400px] h-full items-stretch justify-center relative">
                {/* Controls */}

                <div className="hidden w-[260px] overflow-hidden flex-col gap-4 lg:flex sticky top-0">{controlsContent}</div>
                {/* Chat */}
                <div className="relative flex flex-col h-full gap-2 pt-4 sm:pt-10 w-full md:max-w-[720px] rounded-xl bg-content1 overflow-hidden">
                    <div className="flex flex-grow w-full max-w-full flex-col box-border px-1 gap-2 relative overflow-hidden">
                        <div className="flex sm:h-[40px] border-b-small border-divider flex-col sm:flex-row mx-4 sm:mx-[52px] flex-wrap items-center justify-center gap-2 pb-4 sm:pb-12 sm:justify-between">
                            <p className="text-2xl font-medium">
                                {selectDate}
                                {!journal.id && !isLoading && <span className=" text-sm text-zinc-400">&nbsp;(new)</span>}
                            </p>

                            <ButtonGroup>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    startContent={<Icon icon="ooui:previous-ltr" width={14} />}
                                    onPress={() => {
                                        redirectToNumber(-1);
                                    }}
                                >
                                    {t('Previous')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    isDisabled={!haveNextDay}
                                    size="sm"
                                    endContent={<Icon icon="ooui:previous-rtl" width={14} />}
                                    onPress={() => {
                                        redirectToNumber(1);
                                    }}
                                >
                                    {t('Next')}
                                </Button>
                            </ButtonGroup>
                        </div>

                        {/* <div className="flex-1 w-full overflow-y-auto overflow-visible"> */}
                        {/* 
                                </ScrollShadow> */}

                        <div className="flex-1 basis-0 min-h-0 overflow-y-auto overflow-x-hidden">{editorRender}</div>

                        {/* </div> */}
                        <div className="flex h-10 justify-center items-center">
                            <ButtonGroup variant="ghost" size="base" className="mb-4">
                                <Button>{t('Save')}</Button>
                                <Button>{t('Delete')}</Button>
                                <Button
                                    onPress={() => {
                                        navigate(`/dashboard/${spaceID}/knowledge`);
                                    }}
                                >
                                    {t('Back')}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div className="hidden w-[260px] gap-4 xl:flex justify-end">
                    {/* TODO: New Knowledge & AI QA */}
                    {/* <Button variant="ghost">{t("CreateKnowledge")}</Button> */}
                </div>
            </main>
        </section>
    );
}
