import { languages } from '@codemirror/language-data';
import { EditorState, Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, lineNumbers } from '@codemirror/view';
import {
    CodeBlockEditorProps,
    codeBlockLanguages$,
    codeMirrorAutoLoadLanguageSupport$,
    codeMirrorExtensions$,
    iconComponentFor$,
    readOnly$,
    useCodeBlockEditorContext,
    useTranslation
} from '@mdxeditor/editor';
import { useCellValues } from '@mdxeditor/gurx';
import { basicSetup } from 'codemirror';
import React from 'react';

import { useCodeMirrorRef } from './useCodeMirrorRef';

export const COMMON_STATE_CONFIG_EXTENSIONS: Extension[] = [];
const EMPTY_VALUE = '__EMPTY_VALUE__';

export const CodeMirrorEditor = ({ language, nodeKey, code, focusEmitter }: CodeBlockEditorProps) => {
    let la = language || 'js';
    const t = useTranslation();

    const { parentEditor, lexicalNode } = useCodeBlockEditorContext();
    const [readOnly, codeMirrorExtensions, autoLoadLanguageSupport, codeBlockLanguages] = useCellValues(readOnly$, codeMirrorExtensions$, codeMirrorAutoLoadLanguageSupport$, codeBlockLanguages$);
    const codeMirrorRef = useCodeMirrorRef(nodeKey, 'codeblock', language, focusEmitter);
    const { setCode } = useCodeBlockEditorContext();
    const editorViewRef = React.useRef<EditorView | null>(null);
    const elRef = React.useRef<HTMLDivElement | null>(null);

    const setCodeRef = React.useRef(setCode);

    setCodeRef.current = setCode;
    codeMirrorRef.current = {
        getCodemirror: () => editorViewRef.current!
    };

    React.useEffect(() => {
        void (async () => {
            const extensions = [
                ...codeMirrorExtensions,
                oneDark,
                basicSetup,
                lineNumbers(),
                EditorView.lineWrapping,
                EditorView.updateListener.of(({ state }) => {
                    setCodeRef.current(state.doc.toString());
                })
            ];

            if (readOnly) {
                extensions.push(EditorState.readOnly.of(true));
            }

            if (la !== '' && autoLoadLanguageSupport) {
                const languageData = languages.find(l => {
                    return l.name === la || l.alias.includes(la) || l.extensions.includes(la);
                });

                if (languageData) {
                    try {
                        const languageSupport = await languageData.load();

                        extensions.push(languageSupport.extension);
                    } catch (e) {
                        console.warn('failed to load language support for', la);
                    }
                }
            }
            elRef.current!.innerHTML = '';
            editorViewRef.current = new EditorView({
                parent: elRef.current!,
                state: EditorState.create({ doc: code, extensions })
            });
        })();

        return () => {
            editorViewRef.current?.destroy();
            editorViewRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readOnly, language]);

    return (
        <div
            className="my-2"
            onKeyDown={e => {
                readOnly && e.stopPropagation();
            }}
        >
            <div ref={elRef} />
        </div>
    );
};
