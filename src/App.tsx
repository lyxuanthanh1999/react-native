/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RouteName } from '@/constants';

import { RootNavigator } from '@/services';

import '../global.css';
import './i18n';

import { KeyboardViewSpacer } from './components/keyboardSpace';
import { GluestackUIProvider } from './components/ui';
import DrawerNavigator from './navigation/DrawerNavigator';
import { LoginPage, CalendarScreen } from './screens';
import { ThemeProvider } from './theme/ThemeContext';

import useTheme from '@/hooks/useTheme';

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => {
    return (
        <KeyboardViewSpacer>
            <NavigationContainer ref={RootNavigator.navigationRef}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={RouteName.Login}>
                    <Stack.Screen name={RouteName.Login} component={LoginPage} />
                    <Stack.Screen name={RouteName.DrawerRoot} component={DrawerNavigator} />
                    <Stack.Screen name={RouteName.Calendar} component={CalendarScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </KeyboardViewSpacer>
    );
};

const AppWithTheme = () => {
    const { colorMode } = useTheme();

    return (
        <GluestackUIProvider mode={colorMode}>
            <AppStack />
        </GluestackUIProvider>
    );
};

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AppWithTheme />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
