import { Button, cn, Listbox, ListboxItem, Spinner, Switch, type TextAreaProps, Tooltip, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { t } from 'i18next';
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PromptInput from './prompt-input';

export default function Component(
    props: TextAreaProps & { classNames?: Record<'button' | 'buttonIcon', string>; selectedUseMemory: boolean; onSubmitFunc: (data: string, agent: string) => Promise<void> }
) {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [useRag, setUseRag] = useState(false);

    useEffect(() => {
        setUseRag(props.selectedUseMemory === undefined ? false : props.selectedUseMemory);
    }, [props.selectedUseMemory]);

    // @ts-ignore
    const inputRef = useRef<any>();

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (loading) {
            return;
        }
        // 阻止默认的提交行为
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            // 获取当前光标位置
            const start = inputRef.current.selectionStart;
            const end = inputRef.current.selectionEnd;

            setPrompt(prompt.slice(0, start) + '\n' + prompt.slice(end));

            // 将光标移到新行
            inputRef.current.focus();
            inputRef.current.setSelectionRange(start + 1, start + 1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const keyCode = event.which || event.keyCode;

            if (keyCode === 229) {
                // 触发中文输入法确认中文等回车行为
                return;
            }
            if (props.onSubmitFunc && prompt) {
                setLoading(true);
                try {
                    await props.onSubmitFunc(prompt, useRag ? 'rag' : '');
                    setPrompt('');
                } catch (e: any) {}
                setLoading(false);
            }
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    function setSelectedKeys(e) {
        setPrompt(prompt + e + ' ');
        onClose();
        inputRef.current.focus();
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, inputRef]);

    const onSetPrompt = useCallback(
        (data: string) => {
            if (data.length < prompt.length) {
                setPrompt(data);
                return;
            }
            setPrompt(data);
            const lastChar = data.trim().charAt(data.length - 1);
            if (lastChar === '@') {
                onOpen();
            } else if (isOpen) {
                onClose();
            }
        },
        [isOpen, prompt]
    );

    const agents = useMemo(() => {
        return [
            {
                title: t('agent-jihe'),
                description: '唤起记忆'
            },
            {
                title: t('agent-butler'),
                description: '家庭助理，可以帮您记录任何与清单相关的内容'
            },
            {
                title: t('agent-journal'),
                description: '工作助理，可以查看您的日记并总结'
            }
        ];
    }, []);

    return (
        <form className="flex flex-col w-full items-start gap-2 relative rounded-medium bg-default-100 transition-colors">
            {isOpen && (
                <div className="absolute w-full left-0 top-0">
                    <Listbox
                        disallowEmptySelection
                        aria-label="Single agent selection"
                        className="absolute bottom-1 left-0 bg-content2 rounded-xl"
                        autoFocus="first"
                        selectionMode="single"
                        variant="flat"
                        onAction={setSelectedKeys}
                    >
                        {agents.map(v => {
                            return (
                                <ListboxItem key={v.title} className="h-12">
                                    {v.title} <span className="text-sm text-zinc-400">（{v.description}）</span>
                                </ListboxItem>
                            );
                        })}
                    </Listbox>
                </div>
            )}

            <PromptInput
                {...props}
                ref={inputRef}
                classNames={{
                    inputWrapper: '!bg-transparent shadow-none',
                    innerWrapper: cn('items-center outline-0', props.classNames?.innerWrapper),
                    input: cn('text-medium pl-1 data-[has-start-content=true]:ps-0 data-[has-start-content=true]:pe-0', props.classNames?.input)
                }}
                endContent={
                    <div className="flex gap-2 pt-1">
                        {/* {!prompt && (
                            <Button isIconOnly radius="full" variant="light">
                                <Icon className="text-default-500" icon="solar:microphone-3-linear" width={20} />
                            </Button>
                        )} */}
                        <Tooltip showArrow content="Send message">
                            <Button
                                isIconOnly
                                className={props?.classNames?.button || ''}
                                color={!prompt ? 'default' : 'primary'}
                                isDisabled={!prompt}
                                radius="full"
                                variant={!prompt ? 'flat' : 'solid'}
                                onPress={() => {
                                    props.onSubmitFunc(prompt, useRag ? 'rag' : '');
                                    setPrompt('');
                                }}
                            >
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Icon
                                        className={cn('[&>path]:stroke-[2px]', !prompt ? 'text-default-500' : 'text-primary-foreground', props?.classNames?.buttonIcon || '')}
                                        icon="solar:arrow-up-linear"
                                        width={20}
                                    />
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                }
                // startContent={
                //     <Button isIconOnly className="p-[10px]" radius="full" variant="light">
                //         <Icon className="text-default-500" icon="solar:paperclip-linear" width={20} />
                //     </Button>
                // }
                value={prompt}
                onValueChange={onSetPrompt}
                onKeyDown={handleKeyDown}
            />
            <div className="flex w-full flex-wrap items-center justify-between gap-2 px-3 pb-2">
                <div className="flex flex-wrap gap-3">
                    {/* <Button size="sm" startContent={<Icon className="text-default-500" icon="solar:paperclip-linear" width={18} />} variant="flat">
                        Attach
                    </Button> */}

                    {/* <Button size="sm" startContent={<Icon className="text-default-500" icon="solar:notes-linear" width={18} />} variant="flat">
                        Templates
                    </Button> */}
                </div>
                <div className="flex flex-row justify-end items-end gap-4">
                    <Switch
                        classNames={{
                            base: cn(
                                'inline-flex flex-row-reverse hover:bg-content2 items-center bg-default-100',
                                'justify-between cursor-pointer rounded-lg gap-2 pl-1 pr-2 border-2 border-transparent',
                                'border-default h-8'
                            ),
                            wrapper: 'p-0 h-4 w-10 overflow-visible'
                        }}
                        isSelected={useRag}
                        onValueChange={setUseRag}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-default-500">{t('UseMemory')}</p>
                        </div>
                    </Switch>
                    <p className="py-1 text-tiny text-default-400 w-16 justify-end flex">{prompt.length}/2000</p>
                </div>
            </div>
        </form>
    );
}
