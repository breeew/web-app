import { Icon } from '@iconify/react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { GithubIcon, Logo } from '@/components/icons';
import { Name } from '@/components/logo';

export interface ShareHeaderProps {
    controlsContent: React.ReactNode;
}

export default memo(({ controlsContent }: ShareHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <header className="flex w-full flex-col items-center gap-2 sm:gap-4 pb-4 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-2">
                <Logo size={20} />
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
                <Button
                    className="bg-gradient-to-br from-pink-400 to-indigo-400 dark:from-indigo-500 dark:to-pink-500"
                    startContent={<Icon icon="fluent:brain-sparkle-20-regular" width={20} />}
                    variant="flat"
                    size="sm"
                    onPress={() => navigate('/')}
                >
                    {t('StartCyberMemory')}
                </Button>
            </div>
        </header>
    );
});
