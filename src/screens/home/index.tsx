import React from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';

import { environment } from '@/services';

import { useActions, useLoading } from '@/hooks';
import useTheme from '@/hooks/useTheme';

import { Loading } from '@/components/loading';
import { Box, HStack, ScrollView, Text, VStack } from '@/components/ui';
import { CountActions, ResponseActions } from '@/redux/actions';
import { CountSelectors, ResponseSelectors } from '@/redux/selectors';

import { MyTouchable } from '@/components/touchable';

const HomePage = () => {
    const { isDark } = useTheme();

    const isLoading = useLoading([
        CountActions.increment.type,
        CountActions.decrement.type,
        ResponseActions.getResponse.type,
    ]);

    const [increment, decrement] = useActions([CountActions.increment, CountActions.decrement]);
    const getResponse = useActions(ResponseActions.getResponse);

    const count = useSelector(CountSelectors.count);
    const response = useSelector(ResponseSelectors.response);

    React.useEffect(() => {
        getResponse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box flex={1} className={isDark ? 'bg-background-0' : 'bg-background-0'}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <VStack space="md" alignItems="center" className="pt-6 px-4">
                    <Text className="text-typography-900" size="2xl" fontWeight="bold">
                        {environment.appName}
                    </Text>
                    <Text className="text-typography-600" size="md">
                        Environment: {environment.appFlavor}
                    </Text>
                    <Text className="text-typography-900" size="lg" fontWeight="bold">
                        Response: {response?.length ?? 0}
                    </Text>

                    <Box className="mt-4 rounded-2xl bg-background-50 p-6 w-full items-center">
                        <Text className="text-typography-500 mb-2" size="sm">
                            Counter
                        </Text>
                        <Text className="text-typography-900" size="4xl" fontWeight="bold">
                            {count}
                        </Text>
                        <HStack space="lg" className="mt-4">
                            <MyTouchable
                                onPress={() => decrement()}
                                className="rounded-xl bg-error-500 px-6 py-3">
                                <Text color="white" fontWeight="bold">
                                    −
                                </Text>
                            </MyTouchable>
                            <MyTouchable
                                onPress={() => increment()}
                                className="rounded-xl bg-success-500 px-6 py-3">
                                <Text color="white" fontWeight="bold">
                                    +
                                </Text>
                            </MyTouchable>
                        </HStack>
                    </Box>
                </VStack>
            </ScrollView>
            <Loading isLoading={isLoading} />
        </Box>
    );
};

export default HomePage;
