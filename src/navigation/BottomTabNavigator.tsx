import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import React from 'react';

import { Colors, RouteName } from '@/constants';

import useTheme from '@/hooks/useTheme';

import { ExploreScreen, HomePage, ProfileScreen, SettingsScreen } from '@/screens';

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
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 0.5,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: isDark ? 0.3 : 0.08,
                    shadowRadius: 8,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            })}>
            <Tab.Screen name={RouteName.Home} component={HomePage} />
            <Tab.Screen name={RouteName.Explore} component={ExploreScreen} />
            <Tab.Screen name={RouteName.Profile} component={ProfileScreen} />
            <Tab.Screen name={RouteName.Settings} component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
