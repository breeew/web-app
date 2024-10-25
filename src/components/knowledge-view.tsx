import { Chip, ScrollShadow } from '@nextui-org/react';
import { memo } from 'react';

import Markdown from './markdown';

import { Knowledge } from '@/apis/knowledge';

export default memo(function KnowledgeView({ knowledge }: { knowledge: Knowledge }) {
    return (
        <>
            <ScrollShadow hideScrollBar className="w-full flex-grow box-border p-4 flex  justify-center">
                <div className="w-full h-full md:max-w-[620px]">
                    <div className="w-full my-10 dark:text-gray-100 text-gray-800 text-lg overflow-hidden">
                        <h1 className="text-xl text-gray-800 dark:text-gray-100">{knowledge.title}</h1>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-5">
                        {knowledge.tags &&
                            knowledge.tags.map(item => {
                                return (
                                    <Chip key={item} className="text-gray-600 dark:text-gray-300" size="sm" variant="bordered">
                                        {item}
                                    </Chip>
                                );
                            })}
                    </div>

                    <div className="w-full  overflow-hidden flex-wrap">
                        <Markdown className="w-full text-wrap break-words whitespace-pre-wrap text-gray-600 dark:text-gray-300">{knowledge.content}</Markdown>
                    </div>
                </div>
            </ScrollShadow>
        </>
    );
});
