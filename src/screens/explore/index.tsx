import React from 'react';

import useTheme from '@/hooks/useTheme';

import { Box, Text, VStack } from '@/components/ui';

const ExploreScreen = () => {
    const { isDark } = useTheme();

    return (
        <Box flex={1} className={isDark ? 'bg-background-0' : 'bg-background-0'}>
            <VStack flex={1} alignItems="center" justifyContent="center" space="md" className="px-4">
                <Text className="text-typography-900" size="2xl" fontWeight="bold">
                    Explore
                </Text>
                <Text className="text-typography-500" size="md" textAlign="center">
                    Discover new content and features here.
                </Text>
            </VStack>
        </Box>
    );
};

export default ExploreScreen;
