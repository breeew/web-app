import { Textarea, type TextAreaProps } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import React from 'react';

const PromptInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ classNames = {}, ...props }, ref) => {
    return (
        <Textarea
            ref={ref}
            autoFocus
            aria-label="Prompt"
            className="min-h-[40px]"
            classNames={{
                ...classNames,
                label: cn('hidden', classNames?.label),
                input: cn('py-0', classNames?.input)
            }}
            minRows={1}
            placeholder="Enter a prompt here"
            radius="lg"
            variant="bordered"
            {...props}
        />
    );
});

export default PromptInput;

PromptInput.displayName = 'PromptInput';
