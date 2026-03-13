import React from 'react';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/header';
import { Box, Text, VStack } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

const ProfileScreen = () => {
    const { isDark } = useTheme();
    const { t } = useTranslation();

    return (
        <Box flex={1} safeArea className={isDark ? 'bg-background-0' : 'bg-background-0'}>
            <VStack className="px-4 pt-6" flex={1}>
                <Header title={t('tabs.profile')} />
                <VStack flex={1} alignItems="center" justifyContent="center" space="md">
                    <Box className="items-center justify-center rounded-full bg-primary-500" width={80} height={80}>
                        <Text color="white" size="2xl" fontWeight="bold">
                            U
                        </Text>
                    </Box>
                    <Text className="text-typography-500" size="md" textAlign="center">
                        {t('profile.subTitle')}
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );
};

export default ProfileScreen;
