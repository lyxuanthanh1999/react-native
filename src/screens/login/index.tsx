import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { z } from 'zod';

import { Errors, RouteName } from '@/constants';

import { environment, RootNavigator } from '@/services';

import { getColor } from '@/hooks';

import { ControlledInput } from '@/components/input';
import { MyTouchable } from '@/components/touchable';
import { Box, ScrollView, Text, VStack } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

const RNLogo = () => {
    const { isDark } = useTheme();
    return (
        <Box
            width={80}
            height={80}
            className={`${isDark ? 'bg-primary-500' : 'bg-primary-900'}`}
            borderRadius={16}
            alignItems="center"
            justifyContent="center">
            <Text color="white" fontWeight="bold" fontSize={24}>
                RN
            </Text>
        </Box>
    );
};

const loginSchema = z.object({
    email: z
        .string()
        .min(1, Errors.REQUIRED_EMAIL_INPUT)
        .pipe(z.email(Errors.EMAIL_INVALID))
        .refine((value) => value.endsWith('.com'), {
            message: Errors.IS_NOT_EMAIL,
        }),
    password: z.string().min(1, Errors.REQUIRED_PASSWORD_INPUT),
});

const Login = () => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: 'test@test.com',
            password: '123456',
        },
        resolver: zodResolver(loginSchema),
    });

    const handleLogin = React.useCallback(() => {
        Keyboard.dismiss();
        handleSubmit((_values) => {
            RootNavigator.replaceName(RouteName.DrawerRoot);
        })();
    }, [handleSubmit]);

    return (
        <Box flex={1} safeArea className="bg-background-0">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box flex={1} className="bg-background-0" paddingHorizontal={16}>
                    <VStack alignItems="center" justifyContent="center" marginTop={20} marginBottom={12} space="sm">
                        <RNLogo />
                        <Text className="text-typography-900" size="2xl" fontWeight="bold" marginTop={6}>
                            {t('login.welcomeBack')} {environment.appFlavor}
                        </Text>
                        <Text className="text-typography-500" fontSize={14} marginTop={2}>
                            {t('login.subtitle')}
                        </Text>
                    </VStack>

                    <VStack space="lg" marginTop={6}>
                        <ControlledInput
                            control={control}
                            name="email"
                            placeholder={t('login.emailPlaceholder')}
                            shouldUseFieldError={true}
                            testID="email-input"
                        />

                        <ControlledInput
                            control={control}
                            name="password"
                            placeholder={t('login.passwordPlaceholder')}
                            isPassword
                            shouldUseFieldError={true}
                            testID="password-input"
                        />

                        <Text fontSize={14} color={getColor('primary.500')} fontWeight="medium" textAlign="right">
                            {t('login.forgotPassword')}
                        </Text>

                        <MyTouchable
                            onPress={handleLogin}
                            className="mt-4 items-center rounded-xl bg-primary-600 py-4 shadow-sm"
                            testID="login-button">
                            <Text fontWeight="bold" size="lg" color={isDark ? 'typography-100' : 'white'}>
                                {t('login.signIn')}
                            </Text>
                        </MyTouchable>
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default Login;
