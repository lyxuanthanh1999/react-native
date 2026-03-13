/* eslint-disable react/no-unstable-nested-components */
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Colors, RouteName } from '@/constants';

import { ExploreScreen, HomePage, ProfileScreen, SettingsScreen } from '@/screens';

import useTheme from '@/hooks/useTheme';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
    [RouteName.Home]: { focused: 'home', default: 'home-outline' },
    [RouteName.Explore]: { focused: 'compass', default: 'compass-outline' },
    [RouteName.Profile]: { focused: 'person', default: 'person-outline' },
    [RouteName.Settings]: { focused: 'settings', default: 'settings-outline' },
};

const BottomTabNavigator = () => {
    const { isDark } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons.focused : icons.default;
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tabBarActive,
                tabBarInactiveTintColor: colors.tabBarInactive,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: isDark ? 'rgba(23, 23, 23, 0.90)' : 'rgba(255, 255, 255, 0.90)',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            })}>
            <Tab.Screen name={RouteName.Home} component={HomePage} options={{ title: t('tabs.home') }} />
            <Tab.Screen name={RouteName.Explore} component={ExploreScreen} options={{ title: t('tabs.explore') }} />
            <Tab.Screen name={RouteName.Profile} component={ProfileScreen} options={{ title: t('tabs.profile') }} />
            <Tab.Screen name={RouteName.Settings} component={SettingsScreen} options={{ title: t('tabs.settings') }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
/* eslint-enable react/no-unstable-nested-components */
