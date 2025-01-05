import { Icon } from '@iconify/react';
import { Button, Link, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { GithubIcon } from '@/components/icons';
import { LogoIcon, Name } from '@/components/logo';

export interface ShareHeaderProps {
    controlsContent: React.ReactNode;
}

export default memo(({ controlsContent }: ShareHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <header className="flex w-full items-center gap-2 sm:gap-4 pb-4 flex-row justify-between">
            <div className="flex items-center gap-2">
                <LogoIcon />
                <h1>{Name}</h1>
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
                <Link target="_parent" href="/">
                    <Button
                        className="bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                        startContent={<Icon icon="fluent:brain-sparkle-20-regular" width={20} />}
                        variant="flat"
                        size="sm"
                    >
                        {t('StartCyberMemory')}
                    </Button>
                </Link>
            </div>
        </header>
    );
});
