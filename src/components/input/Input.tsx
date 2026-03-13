import React from 'react';
import { Animated, TextInput, TextInputProps } from 'react-native';

import { getColor } from '@/hooks';

import { MyTouchable } from '../touchable';
import { Box, HStack, IconComponent, Text, VStack } from '../ui';

import useShakeView from './Input.Hook';

import useTheme from '@/hooks/useTheme';

export type InputProps = TextInputProps & {
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    onChangeFocus?: (name: string, isFocus: boolean) => void;
    isPassword?: boolean;
    enable?: boolean;
    title?: string;
    error?: string | boolean;
    isLoading?: boolean;
    height?: number;
    testID?: string;
};

const Input = React.forwardRef<TextInput, InputProps>(
    (
        { placeholder, prefixIcon, suffixIcon, isPassword, enable = true, height = 50, title, error, testID, ...rest },
        ref
    ) => {
        const shake = useShakeView(error);
        const { isDark } = useTheme();

        const [isShowPassword, setIsShowPassword] = React.useState<boolean>(!!isPassword);

        const _handleSecure = React.useCallback(() => {
            setIsShowPassword(!isShowPassword);
        }, [isShowPassword]);

        const _renderShowPassword = React.useMemo(
            () => (
                <MyTouchable onPress={_handleSecure}>
                    <IconComponent font="entypo" name={isShowPassword ? 'eye-with-line' : 'eye'} size={16} />
                </MyTouchable>
            ),
            [_handleSecure, isShowPassword]
        );

        const _renderInput = React.useMemo(() => {
            return (
                <HStack
                    style={{ height }}
                    className={`w-full items-center rounded-2xl border ${!enable ? (isDark ? 'bg-background-800' : 'bg-inputDisable') : isDark ? 'bg-background-900' : 'bg-white'} border-2 px-5 ${error ? 'border-red-500' : isDark ? 'border-background-700' : 'border-gray-100'} `}>
                    <HStack className="h-full flex-1 items-center" space="md">
                        {prefixIcon}
                        <TextInput
                            testID={testID}
                            ref={ref}
                            {...rest}
                            className={`font-body mt-1 h-full w-full font-semibold ${isDark ? 'text-typography-100' : 'text-typography-900'}`}
                            style={{ textAlignVertical: 'top' }}
                            placeholder={placeholder}
                            secureTextEntry={isShowPassword}
                            editable={enable}
                            placeholderTextColor={isDark ? '#cbd5e1' : getColor('iconGrey')}
                        />
                    </HStack>
                    <Box className="pl-3">{suffixIcon ?? (isPassword && _renderShowPassword)}</Box>
                </HStack>
            );
        }, [
            _renderShowPassword,
            enable,
            error,
            height,
            isPassword,
            isShowPassword,
            placeholder,
            prefixIcon,
            ref,
            rest,
            suffixIcon,
            testID,
            isDark,
        ]);

        return (
            <VStack space="sm">
                {title && (
                    <Text className={`${isDark ? 'text-typography-300' : 'text-blackLight/70'} font-mono`}>
                        {title}
                    </Text>
                )}
                <VStack space="xs">
                    <Animated.View style={shake}>{_renderInput}</Animated.View>
                    {!!error && (
                        <Box>
                            <Text testID={`${testID}-error`} className="text-sm text-red">
                                {error}
                            </Text>
                        </Box>
                    )}
                </VStack>
            </VStack>
        );
    }
);

export default Input;

declare global {
    export type TypeInput = 'dropdown' | 'search' | 'phone' | 'date' | 'otp';
}
