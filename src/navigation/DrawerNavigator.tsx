/* eslint-disable react/no-unstable-nested-components */
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native';

import { Colors, RouteName } from '@/constants';

import { RootNavigator } from '@/services';

import { AboutScreen } from '@/screens';

import BottomTabNavigator from './BottomTabNavigator';

import { Box, HStack, Text } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { isDark, setColorMode } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;
    const { t, i18n } = useTranslation();

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: colors.card }}>
            {/* App header */}
            <Box className="mb-2 border-b px-4 pb-6 pt-4" style={{ borderBottomColor: colors.border }}>
                <Box width={48} height={48} className="mb-3 items-center justify-center rounded-xl bg-primary-600">
                    <Text color="white" fontWeight="bold" size="lg">
                        RN
                    </Text>
                </Box>
                <Text className="text-typography-900" size="lg" fontWeight="bold">
                    {t('drawer.appTitle')}
                </Text>
                <Text className="text-typography-500" size="sm">
                    {t('drawer.appSubtitle')}
                </Text>
            </Box>

            <DrawerItemList {...props} />

            <DrawerItem
                label={t('drawer.logout')}
                icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
                onPress={() => {
                    RootNavigator.replaceName(RouteName.Login);
                }}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.tabBarInactive}
                labelStyle={{ fontSize: 15, fontWeight: '500' }}
            />

            {/* Dark mode toggle at bottom */}
            <Box className="mt-4 border-t px-4 pt-4" style={{ borderTopColor: colors.border }}>
                <HStack className="items-center justify-between">
                    <HStack space="sm" className="items-center">
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.text} />
                        <Text className="text-typography-700" size="md">
                            {t('drawer.darkMode')}
                        </Text>
                    </HStack>
                    <Switch
                        value={isDark}
                        onValueChange={(v) => setColorMode(v ? 'dark' : 'light')}
                        trackColor={{ false: '#D4D4D4', true: '#333333' }}
                        thumbColor={isDark ? '#FFFFFF' : '#F5F5F5'}
                    />
                </HStack>
            </Box>
            <Box className="mt-4 border-t px-4 pt-4" style={{ borderTopColor: colors.border }}>
                <HStack className="items-center justify-between">
                    <HStack space="sm" className="items-center">
                        <Ionicons name="language-outline" size={20} color={colors.text} />
                        <Text className="text-typography-700" size="md">
                            {t('settings.languageTitle')} ({i18n.language.toUpperCase()})
                        </Text>
                    </HStack>
                    <Switch
                        value={i18n.language === 'en'}
                        onValueChange={(v) => {
                            i18n.changeLanguage(v ? 'en' : 'vi');
                        }}
                        trackColor={{ false: '#616161ff', true: colors.primary }}
                        thumbColor={isDark ? '#FFFFFF' : '#F5F5F5'}
                    />
                </HStack>
            </Box>
        </DrawerContentScrollView>
    );
};

const DrawerNavigator = () => {
    const { isDark } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.tabBarInactive,
                drawerStyle: {
                    backgroundColor: colors.card,
                    width: 280,
                },
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '500',
                },
            }}>
            <Drawer.Screen
                name={RouteName.MainTabs}
                component={BottomTabNavigator}
                options={{
                    title: t('drawer.home'),
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name={RouteName.About}
                component={AboutScreen}
                options={{
                    title: t('drawer.about'),
                    headerShown: false,
                    headerStyle: { backgroundColor: colors.card },
                    headerTintColor: colors.text,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="information-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
/* eslint-enable react/no-unstable-nested-components */
