import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ColorMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = '@app_color_mode';

interface ThemeContextType {
    colorMode: ColorMode;
    setColorMode: (mode: ColorMode) => void;
    isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
    colorMode: 'system',
    setColorMode: () => {},
    isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [colorMode, setColorModeState] = useState<ColorMode>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
                setColorModeState(stored);
            }
            setIsLoaded(true);
        });
    }, []);

    const setColorMode = useCallback((mode: ColorMode) => {
        setColorModeState(mode);
        AsyncStorage.setItem(STORAGE_KEY, mode);
    }, []);

    const isDark = useMemo(() => {
        if (colorMode === 'system') {
            return systemScheme === 'dark';
        }
        return colorMode === 'dark';
    }, [colorMode, systemScheme]);

    const value = useMemo(
        () => ({ colorMode, setColorMode, isDark }),
        [colorMode, setColorMode, isDark],
    );

    if (!isLoaded) return null;

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
