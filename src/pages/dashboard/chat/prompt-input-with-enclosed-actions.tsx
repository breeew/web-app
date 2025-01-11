import { Icon } from '@iconify/react';
import { Button, cn, Spinner, type TextAreaProps, Tooltip } from '@nextui-org/react';
import { KeyboardEvent, useRef, useState } from 'react';

import PromptInput from './prompt-input';

export default function Component(props: TextAreaProps & { classNames?: Record<'button' | 'buttonIcon', string>; onSubmitFunc: (data: string) => Promise<void> }) {
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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
                    await props.onSubmitFunc(prompt);
                    setPrompt('');
                } catch (e: any) {}
                setLoading(false);
            }
        }
    };

    return (
        <form className="flex w-full items-start gap-2">
            <PromptInput
                {...props}
                ref={inputRef}
                classNames={{
                    innerWrapper: cn('items-center', props.classNames?.innerWrapper),
                    input: cn('text-medium data-[has-start-content=true]:ps-0 data-[has-start-content=true]:pe-0', props.classNames?.input)
                }}
                endContent={
                    <div className="flex gap-2">
                        {/* {!prompt && (
                            <NextFeatureToolTip content="Speak">
                                <Button isIconOnly radius="full" variant="light">
                                    <Icon className="text-default-500" icon="solar:microphone-3-linear" width={20} />
                                </Button>
                            </NextFeatureToolTip>
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
                                    props.onSubmitFunc(prompt);
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
                //     <NextFeatureToolTip content="Add file">
                //         <Button isIconOnly className="p-[10px]" radius="full" variant="light">
                //             <Icon className="text-default-500" icon="solar:paperclip-linear" width={20} />
                //         </Button>
                //     </NextFeatureToolTip>
                // }
                value={prompt}
                onValueChange={setPrompt}
                onKeyDown={handleKeyDown}
            />
        </form>
    );
}
