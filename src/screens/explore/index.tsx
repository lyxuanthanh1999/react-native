import { Ionicons } from '@react-native-vector-icons/ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteName } from '@/constants';

import { Header } from '@/components/header';
import { Box, HStack, Text, VStack } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

const ExploreScreen = () => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#171717' : '#FFFFFF' }}>
            <Box className="flex-1 px-4 pt-4">
                <Header title={t('explore.title')} />

                <VStack className="flex-1 items-center justify-center px-4" space="2xl">
                    <Box className="mb-2 rounded-full bg-[#007AFF]/10 p-6">
                        <Ionicons name="calendar" size={64} color="#007AFF" />
                    </Box>

                    <VStack space="sm" className="mb-6 items-center">
                        <Text className="text-center font-bold text-typography-900" size="2xl">
                            {t('explore.calendarTitle')}
                        </Text>
                        <Text className="text-center text-typography-500" size="md">
                            {t('explore.calendarSubtitle')}
                        </Text>
                    </VStack>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate(RouteName.Calendar)}
                        className="w-full flex-row items-center justify-center rounded-2xl px-6 py-4 shadow-sm"
                        style={{ backgroundColor: '#007AFF' }}>
                        <HStack space="sm" className="items-center">
                            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>
                                {t('explore.openCalendar')}
                            </Text>
                        </HStack>
                    </TouchableOpacity>
                </VStack>
            </Box>
        </SafeAreaView>
    );
};

export default ExploreScreen;
