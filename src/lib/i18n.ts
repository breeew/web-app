import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslation from './i18n/en.json';
import zhTranslation from './i18n/zh.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: { translation: enTranslation },
            zh: { translation: zhTranslation }
        }
    });

export default i18n;
