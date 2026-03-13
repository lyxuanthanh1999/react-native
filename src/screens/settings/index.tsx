import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native';

import { Header } from '@/components/header';
import { MyTouchable } from '@/components/touchable';
import { Box, HStack, Text, VStack } from '@/components/ui';
import useTheme from '@/hooks/useTheme';
import { ColorMode } from '@/theme/ThemeContext';

const SettingsScreen = () => {
    const { colorMode, setColorMode, isDark } = useTheme();
    const { t, i18n } = useTranslation();

    const MODES: { label: string; value: ColorMode }[] = [
        { label: t('settings.light'), value: 'light' },
        { label: t('settings.dark'), value: 'dark' },
        { label: t('settings.system'), value: 'system' },
    ];

    const LANGUAGES = [
        { label: t('settings.language.en'), value: 'en' },
        { label: t('settings.language.vi'), value: 'vi' },
    ];

    return (
        <Box flex={1} safeArea className="bg-background-0">
            <VStack className="px-4 pt-6" space="lg">
                <Header title={t('settings.title')} />

                <Box className="rounded-2xl bg-background-50 p-4">
                    <Text className="mb-3 text-typography-900" size="lg" fontWeight="semibold">
                        {t('settings.appearance')}
                    </Text>

                    <HStack className="mb-4 items-center justify-between">
                        <Text className="text-typography-700" size="md">
                            {t('settings.darkMode')}
                        </Text>
                        <Switch
                            value={isDark}
                            onValueChange={(v) => setColorMode(v ? 'dark' : 'light')}
                            trackColor={{ false: '#D4D4D4', true: '#333333' }}
                            thumbColor={isDark ? '#FFFFFF' : '#F5F5F5'}
                        />
                    </HStack>

                    <Text className="mb-2 text-typography-500" size="sm">
                        {t('settings.themeMode')}
                    </Text>
                    <HStack space="sm">
                        {MODES.map((mode) => {
                            return (
                                <MyTouchable
                                    key={mode.value}
                                    onPress={() => setColorMode(mode.value)}
                                    className={`flex-1 items-center rounded-xl py-3 ${
                                        colorMode === mode.value ? 'bg-primary-500' : 'bg-background-100'
                                    }`}>
                                    <Text
                                        fontWeight="semibold"
                                        size="sm"
                                        className={
                                            colorMode === mode.value
                                                ? isDark
                                                    ? 'text-typography-100'
                                                    : 'text-white'
                                                : 'text-typography-700'
                                        }>
                                        {mode.label}
                                    </Text>
                                </MyTouchable>
                            );
                        })}
                    </HStack>
                </Box>

                <Box className="mt-2 rounded-2xl bg-background-50 p-4">
                    <Text className="mb-3 text-typography-900" size="lg" fontWeight="semibold">
                        {t('settings.languageTitle')}
                    </Text>

                    <HStack space="sm">
                        {LANGUAGES.map((lang) => {
                            const isSelected = i18n.language === lang.value;
                            return (
                                <MyTouchable
                                    key={lang.value}
                                    onPress={() => i18n.changeLanguage(lang.value)}
                                    className={`flex-1 items-center rounded-xl py-3 ${
                                        isSelected ? 'bg-primary-500' : 'bg-background-100'
                                    }`}>
                                    <Text
                                        fontWeight="semibold"
                                        size="sm"
                                        className={
                                            isSelected
                                                ? isDark
                                                    ? 'text-typography-100'
                                                    : 'text-white'
                                                : 'text-typography-700'
                                        }>
                                        {lang.label}
                                    </Text>
                                </MyTouchable>
                            );
                        })}
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default SettingsScreen;
