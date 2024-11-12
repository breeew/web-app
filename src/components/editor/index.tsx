import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import { memo, useEffect } from 'react';

import './style.css';

export interface EditorProps {
    readOnly: boolean;
    data: string | OutputData;
    onValueChange?: () => void;
}

export const Editor = memo(function Editor({ data, readOnly, onValueChange }: EditorProps) {
    useEffect(() => {
        let editorData: OutputData;

        if (typeof data === 'string') {
            editorData = {
                blocks: [
                    {
                        type: 'paragraph',
                        data: {
                            text: data
                        }
                    }
                ]
            };
        } else {
            editorData = data;
        }
        const editor = new EditorJS({
            readOnly: readOnly,
            data: editorData,
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
                code: {
                    class: CodeTool,
                    shortcut: 'CMD+SHIFT+C'
                },
                inlineCode: {
                    class: InlineCode,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+C'
                },
                linkTool: LinkTool,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    shortcut: 'CMD+ALT+T'
                }
            },
            // or await editor.isReady
            onReady: () => {
                console.log('Editor.js is ready to work!');
            },
            onChange: async function (api, event) {
                console.log('something changed', api, event);
                onValueChange && onValueChange(await api.saver.save());
            }
        });

        // editor
        //     .save()
        //     .then(outputData => {
        //         console.log('Article data: ', outputData);
        //     })
        //     .catch(error => {
        //         console.log('Saving failed: ', error);
        //     });
    }, []);

    return <div id="brew-editor" className="" />;
});
