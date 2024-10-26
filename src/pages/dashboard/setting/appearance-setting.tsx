import { RadioGroup, Select, SelectItem, Spacer } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ThemeCustomRadio } from './theme-custom-radio';

import { useTheme } from '@/hooks/use-theme';

interface AppearanceSettingCardProps {
    className?: string;
}

const LanguageOptions = [
    { label: 'English', value: 'en', description: 'English' },
    { label: '中文', value: 'zh', description: 'Chinese' }
];

const AppearanceSetting = React.forwardRef<HTMLDivElement, AppearanceSettingCardProps>(({ className, ...props }, ref) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
    };

    const { isDark, setLightTheme, setDarkTheme } = useTheme();

    const currentTheme = React.useMemo(() => {
        return isDark ? 'dark' : 'light';
    }, [isDark]);

    const modifyTheme = React.useCallback(
        (value: string) => {
            if (value === 'dark') {
                setDarkTheme();
            } else {
                setLightTheme();
            }
        },
        [isDark]
    );

    const modifyLanguage = React.useCallback((lng: string) => {
        if (!lng) {
            return;
        }
        changeLanguage(lng);
    }, []);

    const currentLanguage = React.useMemo(() => {
        if (i18n.language && i18n.language.indexOf('zh') !== -1) {
            return 'zh';
        }

        return i18n.language;
    }, [i18n]);

    return (
        <div ref={ref} className={cn('p-2', className)} {...props}>
            {/* Theme */}
            <div>
                <p className="text-base font-medium text-default-700">{t('Theme')}</p>
                <p className="mt-1 text-sm font-normal text-default-400">Change the appearance of the web.</p>
                {/* Theme radio group */}
                <RadioGroup className="mt-4 flex-wrap" orientation="horizontal" defaultValue={currentTheme} onValueChange={modifyTheme}>
                    <ThemeCustomRadio value="light" variant="light">
                        Light
                    </ThemeCustomRadio>
                    <ThemeCustomRadio value="dark" variant="dark">
                        Dark
                    </ThemeCustomRadio>
                </RadioGroup>
            </div>
            <Spacer y={4} />
            {/* Font size */}
            {currentLanguage && (
                <div className="flex items-start justify-between gap-2 py-2">
                    <div>
                        <p className="text-base font-medium text-default-700">{t('Language')}</p>
                        <p className="mt-1 text-sm font-normal text-default-400">Modify web language.</p>
                    </div>
                    <Select className="max-w-[200px]" defaultSelectedKeys={[currentLanguage]} onSelectionChange={modifyLanguage}>
                        {LanguageOptions.map(LanguageOption => (
                            <SelectItem key={LanguageOption.value} value={LanguageOption.value}>
                                {LanguageOption.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            )}
        </div>
    );
});

AppearanceSetting.displayName = 'AppearanceSetting';

export default AppearanceSetting;
