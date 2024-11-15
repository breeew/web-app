import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import { Skeleton } from '@nextui-org/react';
import { memo, useEffect, useState } from 'react';
import showdown from 'showdown';

import './style.css';

export interface EditorProps {
    readOnly: boolean;
    data: string | OutputData;
    dataType?: string;
    placeholder?: string;
    autofocus?: boolean;
    onValueChange?: () => void;
}

export const Editor = memo(function Editor({ data, dataType = '', autofocus = false, placeholder, readOnly, onValueChange }: EditorProps) {
    const [isReady, setIsReady] = useState(false);

    console.log('editor data', data, dataType);

    useEffect(() => {
        const renderFunc = async function (editor: EditorJS, data: string | OutputData, dataType: string) {
            if (!data) {
                return;
            }
            switch (dataType.toLowerCase()) {
                case 'html':
                    await editor.blocks.renderFromHTML(data);
                    break;
                case 'blocks':
                    await editor.blocks.render(data);
                    break;
                default: // default will be markdown
                    // await editor.blocks.render({
                    //     blocks: [
                    //         {
                    //             type: 'paragraph',
                    //             data: {
                    //                 text: data
                    //             }
                    //         }
                    //     ]
                    // });
                    // return;
                    showdown.extension('code', function () {
                        return [
                            {
                                type: 'output',
                                filter: function (text, converter, options) {
                                    return text.replace(/<pre(?: class="[^"]*")?>([\s\S]+?)<\/pre>/g, function (fullMatch, inCode) {
                                        return '<code contenteditable="true">' + inCode + '</code>';
                                    });
                                }
                            }
                        ];
                    });

                    const converter = new showdown.Converter({ extensions: ['code'] });
                    let htmlDoms = converter.makeHtml(data);

                    if (!htmlDoms.trim().startsWith('<div>')) {
                        htmlDoms = '<div>' + htmlDoms + '</div>';
                    }

                    try {
                        await editor.blocks.renderFromHTML(htmlDoms);
                    } catch (e: any) {
                        console.error('editor render error', e);
                        await editor.render([
                            {
                                type: 'paragraph',
                                data: { text: data || '' }
                            }
                        ]);
                    }
            }
        };

        const editor = new EditorJS({
            minHeight: 50, // https://github.com/codex-team/editor.js/issues/1300
            placeholder: placeholder,
            readOnly: readOnly,
            autofocus: !readOnly && autofocus,
            /**
             * Id of Element that should contain the Editor
             */
            holder: 'brew-editor',
            tools: {
                /**
                 * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
                 */
                header: {
                    class: Header,
                    inlineToolbar: ['marker', 'link'],
                    config: {
                        placeholder: 'Header'
                    },
                    shortcut: 'CMD+SHIFT+H'
                },
                /**
                 * Or pass class directly without any configuration
                 */
                image: SimpleImage,
                list: {
                    class: List,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+L'
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: "Quote's author"
                    },
                    shortcut: 'CMD+SHIFT+O'
                },
                marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M'
                },
                codeBox: {
                    class: CodeTool,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+C',
                    conversionConfig: {
                        import(str: string): string {
                            return str;
                        },
                        export(data): string {
                            return data.code;
                        }
                    }
                },
                inlineCode: {
                    class: InlineCode,
                    inlineToolbar: true
                },
                // link: LinkTool, import LinkTool from '@editorjs/link';
                table: {
                    class: Table,
                    inlineToolbar: true,
                    shortcut: 'CMD+ALT+T'
                }
            },
            // or await editor.isReady
            onReady: async () => {
                await renderFunc(editor, data, dataType);
                setIsReady(true);
            },
            onChange: async function (api, _) {
                onValueChange && onValueChange(await api.saver.save());
            }
        });
    }, []);

    return (
        <Skeleton isLoaded={isReady}>
            <div id="brew-editor" className="editor" />
        </Skeleton>
    );
});
