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

import { Journal } from '@/apis/journal';
import KnowledgeAITaskList from '@/components/ai-tasks-list';
import { Editor } from '@/components/editor/index';

const Test_Text = `
<div>
    <p>
      Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
      consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim
      nostrud elit officia tempor esse quis.
    </p>
    <p>
      Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
      cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
      quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit
      incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
      deserunt nostrud ad veniam.
    </p>
    <p>
      Est velit labore esse esse cupidatat. Velit id elit consequat minim. Mollit enim excepteur ea
      laboris adipisicing aliqua proident occaecat do do adipisicing adipisicing ut fugiat.
      Consequat pariatur ullamco aute sunt esse. Irure excepteur eu non eiusmod. Commodo commodo et
      ad ipsum elit esse pariatur sit adipisicing sunt excepteur enim.
    </p>
    <p>
      Incididunt duis commodo mollit esse veniam non exercitation dolore occaecat ea nostrud
      laboris. Adipisicing occaecat fugiat fugiat irure fugiat in magna non consectetur proident
      fugiat. Commodo magna et aliqua elit sint cupidatat. Sint aute ullamco enim cillum anim ex.
      Est eiusmod commodo occaecat consequat laboris est do duis. Enim incididunt non culpa velit
      quis aute in elit magna ullamco in consequat ex proident.
    </p>
    <p>
      Dolore incididunt mollit fugiat pariatur cupidatat ipsum laborum cillum. Commodo consequat
      velit cupidatat duis ex nisi non aliquip ad ea pariatur do culpa. Eiusmod proident adipisicing
      tempor tempor qui pariatur voluptate dolor do ea commodo. Veniam voluptate cupidatat ex nisi
      do ullamco in quis elit.
    </p>
    <p>
      Cillum proident veniam cupidatat pariatur laborum tempor cupidatat anim eiusmod id nostrud
      pariatur tempor reprehenderit. Do esse ullamco laboris sunt proident est ea exercitation
      cupidatat. Do Lorem eiusmod aliqua culpa ullamco consectetur veniam voluptate cillum. Dolor
      consequat cillum tempor laboris mollit laborum reprehenderit reprehenderit veniam aliqua
      deserunt cupidatat consequat id.
    </p>
    <p>
      Est id tempor excepteur enim labore sint aliquip consequat duis minim tempor proident. Dolor
      incididunt aliquip minim elit ea. Exercitation non officia eu id.
    </p>
    <p>
      Ipsum ipsum consequat incididunt do aliquip pariatur nostrud. Qui ut sint culpa labore Lorem.
      Magna deserunt aliquip aute duis consectetur magna amet anim. Magna fugiat est nostrud veniam.
      Officia duis ea sunt aliqua.
    </p>
    <p>
      Ipsum minim officia aute anim minim aute aliquip aute non in non. Ipsum aliquip proident ut
      dolore eiusmod ad fugiat fugiat ut ex. Ea velit Lorem ut et commodo nulla voluptate veniam ea
      et aliqua esse id. Pariatur dolor et adipisicing ea mollit. Ipsum non irure proident ipsum
      dolore aliquip adipisicing laborum irure dolor nostrud occaecat exercitation.
    </p>
    <p>
      Culpa qui reprehenderit nostrud aliqua reprehenderit et ullamco proident nisi commodo non ut.
      Ipsum quis irure nisi sint do qui velit nisi. Sunt voluptate eu reprehenderit tempor consequat
      eiusmod Lorem irure velit duis Lorem laboris ipsum cupidatat. Pariatur excepteur tempor veniam
      cillum et nulla ipsum veniam ad ipsum ad aute. Est officia duis pariatur ad eiusmod id
      voluptate.
    </p>
  </div>`;

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
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        setIsLoading(true);
        try {
            onBlocksChanged({ blocks: [] });
        } catch (e: any) {
            console.error(e);
        }
        setIsLoading(false);
    }, [currentSelectedDate]);

    const [journalTodos, setJournalTodos] = useState<TodoList[]>([]);

    const onBlocksChanged = useCallback((blocks: OutputData) => {
        setBlocks(blocks);
        if (!blocks.blocks) {
            return;
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
            previousBlock = item;
        }
        setJournalTodos(todos);
    }, []);

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
                <Calendar
                    aria-label="Date (Max Date Value)"
                    value={currentSelectedDate}
                    maxValue={today(getLocalTimeZone())}
                    onChange={v => {
                        redirectTo(v);
                    }}
                />
                <div className="mt-2 flex w-full flex-col gap-2 px-1">
                    {journalTodos.length > 0 && <div className="pb-2 px-2 text-zinc-500 text-sm">{t('Journal Todos')}</div>}
                    {journalTodos.map(v => {
                        return (
                            <>
                                <h1>{v.title}</h1>
                                <div className="journal__todo">{renderTodoListItem(false, v.list)}</div>
                            </>
                        );
                    })}
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
        return (
            <ul>
                {list.map(v => {
                    return (
                        <>
                            <li key={v.content} className="cdx-list__item">
                                <Checkbox
                                    value={v.content}
                                    isSelected={v.checked}
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
    const todoRender = useMemo(() => {}, [journalTodos]);

    const [readonly, setReadonly] = useState(false);
    return (
        <section className="h-screen flex flex-col w-full p-4 overflow-hidden items-center">
            <header className="flex w-full flex-col items-center gap-4 pb-6 lg:flex-row lg:justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="">
                        <Breadcrumbs size="lg">
                            <BreadcrumbItem>Main</BreadcrumbItem>
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
                    <Button size="sm" variant="flat">
                        Save
                    </Button>
                    <Button color="danger" size="sm" variant="flat">
                        Delete
                    </Button>
                </div>
            </header>

            <main className="flex gap-10 w-full max-w-[1400px] h-full justify-center overflow-hidden relative">
                {/* Controls */}
                <div className="hidden max-w-[300px] w-[300px] overflow-hidden flex-col gap-4 lg:flex">{controlsContent}</div>
                {/* Chat */}
                <div className="relative flex flex-col h-full gap-2 w-full md:max-w-[720px]">
                    <div className="flex flex-grow w-full max-w-full flex-col gap-2 overflow-hidden relative">
                        <div className="flex w-full h-[40px] flex-wrap items-center justify-center gap-2 border-b-small border-divider pb-2 sm:justify-between">
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
                            <p className="text-2xl font-medium">{selectDate}</p>

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
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollShadow hideScrollBar className="flex flex-col h-full flex-grow pl-[60px]">
                                {blocks && <Editor ref={editor} autofocus data={blocks} dataType="blocks" placeholder={t('knowledgeCreateContentLabelPlaceholder')} onValueChange={onBlocksChanged} />}
                            </ScrollShadow>
                        </div>
                        <div className="flex h-13 justify-center items-center">
                            <ButtonGroup variant="flat" size="base" className="mb-4">
                                <Button color="primary">{t('Save')}</Button>
                                <Button color="danger">{t('Delete')}</Button>
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
                <div className="hidden max-w-[300px] w-[300px] gap-4 xl:flex justify-end">
                    <KnowledgeAITaskList />
                    <Button variant="ghost">快速创建记忆</Button>
                </div>
            </main>
        </section>
    );
}
