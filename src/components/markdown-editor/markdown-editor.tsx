import { oneDark } from '@codemirror/theme-one-dark';
import {
    ChangeCodeMirrorLanguage,
    codeBlockPlugin,
    codeMirrorPlugin,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    headingsPlugin,
    InsertCodeBlock,
    InsertTable,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    MDXEditor,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { basicLightTheme } from 'cm6-theme-basic-light';
import { memo, useEffect, useMemo, useState } from 'react';
import { subscribeKey } from 'valtio/utils';

// import { codeMirrorPlugin } from '@/components/markdown-editor/codemirror/index';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import eventStore from '@/stores/event';

export interface MarkdownEditorProps {
    content: string;
    placeholder: string;
    readOnly: boolean;
    className: string;
    onValueChange: (v: string) => void;
}

const MarkdownEditor = memo(function MarkdownEditor({ content, placeholder, readOnly, onValueChange, className, ...rest }: MarkdownEditorProps) {
    const { theme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(theme);

    useEffect(() => {
        const unSubscribe = subscribeKey(eventStore, 'themeChange', (theme: string) => {
            setCurrentTheme(theme);
        });

        return unSubscribe;
    });

    const codeTheme = useMemo(() => {
        if (currentTheme === 'dark') {
            return oneDark;
        }

        return basicLightTheme;
    }, [currentTheme]);

    const darkModeClassNames = useMemo(() => {
        if (currentTheme === 'dark') {
            return 'dark-theme dark-editor';
        }

        return '';
    }, [currentTheme]);

    const toolBar = useMemo(() => {
        if (readOnly) {
            return {
                init: function () {}
            };
        }

        return toolbarPlugin({
            toolbarContents: () => (
                <ConditionalContents
                    options={[
                        {
                            when: editor => editor?.editorType === 'codeblock',
                            contents: () => <ChangeCodeMirrorLanguage />
                        },
                        {
                            fallback: () => (
                                <>
                                    <CreateLink />
                                    <ListsToggle />
                                    <InsertTable />
                                    <CodeToggle />
                                    <InsertCodeBlock />
                                </>
                            )
                        }
                    ]}
                />
            )
        });
    }, [readOnly]);

    return (
        <MDXEditor
            {...rest}
            className={cn(darkModeClassNames, className)}
            markdown={content}
            placeholder={placeholder}
            trim={false}
            plugins={[
                codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                codeMirrorPlugin({
                    codeMirrorExtensions: [codeTheme],
                    codeBlockLanguages: { js: 'JavaScript', shell: 'Shell', yaml: 'Yaml', toml: 'Toml', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript', '': 'TypeScript' }
                }),
                linkPlugin(),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                tablePlugin(),
                toolBar
            ]}
            onChange={onValueChange}
        />
    );
});

export default MarkdownEditor;

// const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
//     // always use the editor, no matter the language or the meta of the code block
//     match: (language, meta) => true,
//     // You can have multiple editors with different priorities, so that there's a "catch-all" editor (with the lowest priority)
//     priority: 0,
//     // The Editor is a React component
//     Editor: CodeMirrorEditor
// };
