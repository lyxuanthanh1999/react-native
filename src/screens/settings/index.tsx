import React from 'react';
import { Switch } from 'react-native';

import useTheme from '@/hooks/useTheme';

import { MyTouchable } from '@/components/touchable';
import { Box, HStack, Text, VStack } from '@/components/ui';
import { ColorMode } from '@/theme/ThemeContext';

const MODES: { label: string; value: ColorMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
];

const SettingsScreen = () => {
    const { colorMode, setColorMode, isDark } = useTheme();
    
    return (
        <Box flex={1} safeArea className="bg-background-0">
            <VStack className="px-4 pt-6" space="lg">
                <Text className="text-typography-900" size="2xl" fontWeight="bold">
                    Settings
                </Text>

                {/* Dark mode section */}
                <Box className="rounded-2xl bg-background-50 p-4">
                    <Text className="text-typography-900 mb-3" size="lg" fontWeight="semibold">
                        Appearance
                    </Text>

                    {/* Quick toggle */}
                    <HStack className="justify-between items-center mb-4">
                        <Text className="text-typography-700" size="md">
                            Dark Mode
                        </Text>
                        <Switch
                            value={isDark}
                            onValueChange={(v) => setColorMode(v ? 'dark' : 'light')}
                            trackColor={{ false: '#D4D4D4', true: '#333333' }}
                            thumbColor={isDark ? '#FFFFFF' : '#F5F5F5'}
                        />
                    </HStack>

                    {/* Mode selector */}
                    <Text className="text-typography-500 mb-2" size="sm">
                        Theme Mode
                    </Text>
                    <HStack space="sm">
                        {MODES.map((mode) => {
                            return <MyTouchable
                                key={mode.value}
                                onPress={() => setColorMode(mode.value)}
                                className={`flex-1 items-center rounded-xl py-3 ${
                                    colorMode === mode.value
                                        ? 'bg-primary-500'
                                        : 'bg-background-100'
                                }`}>
                                <Text
                                    fontWeight="semibold"
                                    size="sm"
                                    className={
                                        colorMode === mode.value
                                            ? isDark ? 'text-typography-100' : 'text-white'
                                            : 'text-typography-700'
                                    }>
                                    {mode.label}
                                </Text>
                            </MyTouchable>
                        })}
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default SettingsScreen;
