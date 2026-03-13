import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import vi from '../locales/vi.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
            if (savedLanguage) {
                return callback(savedLanguage);
            }
            return callback('en');
        } catch (error) {
            console.warn('Error reading language', error);
            return callback('en');
        }
    },
    init: () => {},
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, lng);
        } catch (error) {
            console.warn('Error saving language', error);
        }
    },
};

i18n.use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        compatibilityJSON: 'v4', // Required for React Native
    });

export default i18n;
