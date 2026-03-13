import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import React from 'react';

import { MyTouchable } from '@/components/touchable';
import { HStack, Text } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

interface HeaderProps {
    title: string;
    showBack?: boolean;
}

export const Header = ({ title, showBack }: HeaderProps) => {
    const { isDark } = useTheme();
    const navigation = useNavigation();

    return (
        <HStack className="mb-4 items-center justify-between">
            <Text className="text-typography-900" size="2xl" fontWeight="bold">
                {title}
            </Text>

            {showBack ? (
                <MyTouchable
                    onPress={() => navigation.goBack()}
                    className="-mr-2 items-center justify-center rounded-full p-2">
                    <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#FFFFFF' : '#171717'} />
                </MyTouchable>
            ) : (
                <MyTouchable
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    className="-mr-2 items-center justify-center rounded-full p-2">
                    <Ionicons name="menu-outline" size={28} color={isDark ? '#FFFFFF' : '#171717'} />
                </MyTouchable>
            )}
        </HStack>
    );
};
