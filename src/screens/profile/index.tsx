import React from 'react';

import useTheme from '@/hooks/useTheme';

import { Box, Text, VStack } from '@/components/ui';

const ProfileScreen = () => {
    const { isDark } = useTheme();

    return (
        <Box flex={1} className={isDark ? 'bg-background-0' : 'bg-background-0'}>
            <VStack flex={1} alignItems="center" justifyContent="center" space="md" className="px-4">
                <Box
                    className="rounded-full bg-primary-500 items-center justify-center"
                    width={80}
                    height={80}>
                    <Text color="white" size="2xl" fontWeight="bold">
                        U
                    </Text>
                </Box>
                <Text className="text-typography-900" size="2xl" fontWeight="bold">
                    Profile
                </Text>
                <Text className="text-typography-500" size="md" textAlign="center">
                    Manage your account and preferences.
                </Text>
            </VStack>
        </Box>
    );
};

export default ProfileScreen;
