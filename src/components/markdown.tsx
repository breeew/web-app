import { memo, useEffect, useMemo, useState } from 'react';
// https://github.com/remarkjs/react-markdown
import Markdown, { type ExtraProps, type Options } from 'react-markdown';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';
import stringWidth from 'string-width';
import { subscribeKey } from 'valtio/utils';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import eventStore from '@/stores/event';

export default memo(function MarkdownComponent(props: Options & { isLight?: boolean }) {
    const { children, isLight, className, ...rest } = props;
    const cps = useMemo(() => {
        if (isLight) {
            return undefined;
        }

        return { code: code, a: CustomLink };
    }, [isLight]);

    let markdownClassName = className ? className : '';

    markdownClassName += ' markdown-box';

    return (
        <>
            <Markdown {...rest} className={markdownClassName} remarkPlugins={[[remarkGfm, { stringLength: stringWidth }]]} components={cps}>
                {children as string}
            </Markdown>
        </>
    );
});

const CustomLink = ({ href, children }) => {
    return (
        <a href={href} className={href && href !== '#' && 'text-blue-400'} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
};

const code = function Code(props: ExtraProps) {
    // @ts-ignore
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');

    const { isDark } = useTheme();
    const [change, setChange] = useState(false);

    useEffect(() => {
        if (!match) {
            return;
        }
        const unSubscribe = subscribeKey(eventStore, 'themeChange', () => {
            setChange(prev => !prev);
        });

        return unSubscribe;
    }, [match]);

    const usedStyle = useMemo(() => {
        const _isDark = !change ? isDark : !isDark;

        if (_isDark) {
            return atomOneDark;
        } else {
            return atomOneLight;
        }
    }, [change]);

    return match ? (
        <SyntaxHighlighter {...rest} wrapLines wrapLongLines className="overflow-hidden my-2 rounded-lg !p-4" PreTag="div" language={match[1]} style={usedStyle}>
            {/* {String(children).replace(/\n$/, '')} */}
            {children}
        </SyntaxHighlighter>
    ) : (
        <code {...rest} className={cn('text-wrap', className)}>
            {children}
        </code>
    );
};
