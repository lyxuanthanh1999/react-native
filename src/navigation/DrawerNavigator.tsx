import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { Switch } from 'react-native';

import { Colors, RouteName } from '@/constants';

import useTheme from '@/hooks/useTheme';

import { Box, HStack, Text } from '@/components/ui';
import { AboutScreen } from '@/screens';

import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { isDark, setColorMode } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: colors.card }}>
            {/* App header */}
            <Box className="px-4 pt-4 pb-6 mb-2 border-b" style={{ borderBottomColor: colors.border }}>
                <Box
                    width={48}
                    height={48}
                    className="rounded-xl bg-primary-600 items-center justify-center mb-3">
                    <Text color="white" fontWeight="bold" size="lg">
                        RN
                    </Text>
                </Box>
                <Text className="text-typography-900" size="lg" fontWeight="bold">
                    New React Native
                </Text>
                <Text className="text-typography-500" size="sm">
                    Boilerplate Project
                </Text>
            </Box>

            <DrawerItemList {...props} />

            {/* Dark mode toggle at bottom */}
            <Box className="px-4 pt-4 mt-4 border-t" style={{ borderTopColor: colors.border }}>
                <HStack className="justify-between items-center">
                    <HStack space="sm" className="items-center">
                        <Ionicons
                            name={isDark ? 'moon' : 'sunny'}
                            size={20}
                            color={colors.text}
                        />
                        <Text className="text-typography-700" size="md">
                            Dark Mode
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
        </DrawerContentScrollView>
    );
};

const DrawerNavigator = () => {
    const { isDark } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;

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
                    title: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name={RouteName.About}
                component={AboutScreen}
                options={{
                    title: 'About',
                    headerShown: true,
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
