import React from 'react';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/header';
import { Box, Text, VStack } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

const AboutScreen = () => {
    const { isDark } = useTheme();
    const { t } = useTranslation();

    return (
        <Box flex={1} safeArea paddingHorizontal={10} className={isDark ? 'bg-background-0' : 'bg-background-0'}>
            <Header title={t('drawer.about')} />
            <VStack flex={1} alignItems="center" justifyContent="center" space="md" className="px-4">
                <Box width={80} height={80} className="items-center justify-center rounded-2xl bg-primary-600">
                    <Text color="white" fontWeight="bold" size="2xl">
                        RN
                    </Text>
                </Box>
                <Text className="text-typography-900" size="2xl" fontWeight="bold">
                    About
                </Text>
                <Text className="text-typography-500" size="md" textAlign="center">
                    New React Native Boilerplate
                </Text>
                <Text className="text-typography-400" size="sm">
                    Version 1.0.0
                </Text>
            </VStack>
        </Box>
    );
};

export default AboutScreen;
