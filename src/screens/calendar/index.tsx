import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Linking,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Header } from '@/components/header';
import { Box, HStack, Text, VStack } from '@/components/ui';
import { useExpoCalendar, CalendarEvent } from '@/hooks/useExpoCalendar';
import useTheme from '@/hooks/useTheme';

const CalendarScreen = () => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [selectedDate, setSelectedDate] = useState(today);

    // ─── Custom Hook for Calendar Logic ────────────────────────────────
    const { events, allEvents, hasPermission, isLoading, loadEventsForMonth, createEvent } =
        useExpoCalendar(selectedDate);

    // ─── Initial load ──────────────────────────────────────────────────
    useEffect(() => {
        if (hasPermission) {
            loadEventsForMonth(today);
        }
    }, [hasPermission, today, loadEventsForMonth]);

    // ─── Event Creation Modal State ────────────────────────────────────
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventLocation, setNewEventLocation] = useState('');
    const [newEventNotes, setNewEventNotes] = useState('');

    const defaultStart = new Date();
    defaultStart.setHours(9, 0, 0, 0);
    const defaultEnd = new Date();
    defaultEnd.setHours(10, 0, 0, 0);

    const [newEventStartTime, setNewEventStartTime] = useState(defaultStart);
    const [newEventEndTime, setNewEventEndTime] = useState(defaultEnd);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    // ─── Marked dates for calendar dots ────────────────────────────────
    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        Object.keys(allEvents).forEach((date) => {
            if (allEvents[date].length > 0) {
                marks[date] = { marked: true, dotColor: '#007AFF' };
            }
        });
        marks[selectedDate] = {
            ...(marks[selectedDate] || {}),
            selected: true,
            selectedColor: '#007AFF',
        };
        return marks;
    }, [allEvents, selectedDate]);

    // ─── Open native iOS Calendar event ────────────────────────────────
    const openEventInCalendar = useCallback(async (event: CalendarEvent) => {
        if (Platform.OS === 'ios') {
            // calshow: uses Unix timestamp to open Calendar at that date
            const timestamp = event.startDate.getTime() / 1000;
            const url = `calshow:${timestamp}`;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                // Fallback: open Calendar app without specific date
                await Linking.openURL('calshow:');
            }
        } else {
            // Android: open default calendar app
            try {
                await Linking.openURL('content://com.android.calendar/time/' + event.startDate.getTime());
            } catch {
                await Linking.openURL('content://com.android.calendar/time/');
            }
        }
    }, []);

    // ─── Open add event modal ──────────────────────────────────────────
    const openAddEventModal = useCallback(() => {
        if (!hasPermission) return;
        const start = new Date(selectedDate);
        start.setHours(9, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(10, 0, 0, 0);

        setNewEventTitle('');
        setNewEventLocation('');
        setNewEventNotes('');
        setNewEventStartTime(start);
        setNewEventEndTime(end);
        setIsModalVisible(true);
    }, [hasPermission, selectedDate]);

    // ─── Submit new event ──────────────────────────────────────────────
    const submitNewEvent = useCallback(async () => {
        if (!newEventTitle.trim()) {
            Alert.alert('Error', t('explore.errorTitleRequired'));
            return;
        }

        if (newEventEndTime <= newEventStartTime) {
            Alert.alert('Error', t('explore.errorTimeInvalid'));
            return;
        }

        try {
            const success = await createEvent({
                title: newEventTitle,
                startDate: newEventStartTime,
                endDate: newEventEndTime,
                location: newEventLocation || undefined,
                notes: newEventNotes || undefined,
                timeZone: 'Asia/Ho_Chi_Minh',
                alarms: [{ relativeOffset: -15 }],
            });

            if (success) {
                Alert.alert('✓', t('explore.eventCreated'));
                setIsModalVisible(false);
            }
        } catch {
            Alert.alert('Error', 'Failed to save event');
        }
    }, [newEventTitle, newEventStartTime, newEventEndTime, newEventLocation, newEventNotes, t, createEvent]);

    // ─── Open Settings (if permission denied) ──────────────────────────
    const openAppSettings = useCallback(() => {
        Linking.openSettings();
    }, []);

    // ─── Format event time ─────────────────────────────────────────────
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // ─── Render Event Card ─────────────────────────────────────────────
    const renderEvent = ({ item }: { item: CalendarEvent }) => (
        <TouchableOpacity activeOpacity={0.7} onPress={() => openEventInCalendar(item)}>
            <Box
                className={`mx-4 mb-3 rounded-xl p-4 ${isDark ? 'bg-background-100' : 'bg-background-0'}`}
                style={{
                    shadowColor: isDark ? '#000' : '#9CA3AF',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0.4 : 0.12,
                    shadowRadius: 4,
                    elevation: 3,
                }}>
                <HStack space="md" className="items-center">
                    <Box
                        className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-background-200' : 'bg-background-50'}`}>
                        <Ionicons name="calendar-outline" size={18} color={isDark ? '#A3A3A3' : '#525252'} />
                    </Box>
                    <VStack flex={1}>
                        <Text className="font-semibold text-typography-900" size="md" numberOfLines={1}>
                            {item.title}
                        </Text>
                        <HStack space="xs" className="mt-1 items-center">
                            <Ionicons name="time-outline" size={13} color={isDark ? '#737373' : '#9CA3AF'} />
                            <Text className="text-typography-500" size="sm">
                                {item.allDay
                                    ? t('explore.allDay')
                                    : `${formatTime(item.startDate)} - ${formatTime(item.endDate)}`}
                            </Text>
                        </HStack>
                        {item.location ? (
                            <HStack space="xs" className="mt-1 items-center">
                                <Ionicons name="location-outline" size={13} color={isDark ? '#737373' : '#9CA3AF'} />
                                <Text className="text-typography-500" size="xs" numberOfLines={1}>
                                    {item.location}
                                </Text>
                            </HStack>
                        ) : null}
                    </VStack>
                    <Ionicons name="chevron-forward" size={16} color={isDark ? '#525252' : '#D4D4D4'} />
                </HStack>
            </Box>
        </TouchableOpacity>
    );

    // ─── Calendar adaptive theme ───────────────────────────────────────
    const calendarTheme = useMemo(
        () => ({
            calendarBackground: isDark ? '#1E1E1E' : '#FFFFFF',
            monthTextColor: isDark ? '#F5F5F5' : '#1A1A1A',
            textSectionTitleColor: isDark ? '#A3A3A3' : '#737373',
            dayTextColor: isDark ? '#F5F5F5' : '#1A1A1A',
            todayTextColor: '#007AFF',
            textDisabledColor: isDark ? '#404040' : '#D4D4D4',
            arrowColor: '#007AFF',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#FFFFFF',
            dotColor: '#007AFF',
        }),
        [isDark]
    );

    // ─── Permission Denied View ────────────────────────────────────────
    if (hasPermission === false) {
        return (
            <Box flex={1} safeArea className="bg-background-0">
                <VStack flex={1}>
                    <Box className="bg-background-0 px-4 pb-2 pt-6">
                        <Header title={t('tabs.explore')} />
                    </Box>
                    <VStack flex={1} className="items-center justify-center px-8">
                        <Ionicons name="lock-closed-outline" size={64} color={isDark ? '#404040' : '#D4D4D4'} />
                        <Text className="mt-4 text-center font-semibold text-typography-700" size="lg">
                            {t('explore.permissionTitle')}
                        </Text>
                        <Text className="mt-2 text-center text-typography-400" size="sm">
                            {t('explore.permissionDenied')}
                        </Text>
                        <TouchableOpacity
                            onPress={openAppSettings}
                            className="mt-6 rounded-xl px-6 py-3"
                            style={{ backgroundColor: '#007AFF' }}>
                            <Text style={{ color: '#fff', fontWeight: '600' }} size="md">
                                {t('explore.openSettings')}
                            </Text>
                        </TouchableOpacity>
                    </VStack>
                </VStack>
            </Box>
        );
    }

    // ─── Main View ─────────────────────────────────────────────────────
    return (
        <Box flex={1} safeArea className="bg-background-0">
            <VStack flex={1} className="bg-background-0">
                {/* Header */}
                <Box className="bg-background-0 px-4 pb-2 pt-6">
                    <Header title={t('explore.calendarTitle')} showBack={true} />
                </Box>

                {/* Calendar */}
                <Box className="bg-background-0">
                    <Calendar
                        key={isDark ? 'dark' : 'light'}
                        current={today}
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        onMonthChange={(month: any) => loadEventsForMonth(month.dateString)}
                        markedDates={markedDates}
                        enableSwipeMonths={true}
                        theme={calendarTheme}
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: isDark ? '#2E2E2E' : '#E5E5E5',
                        }}
                    />
                </Box>

                {/* Events List */}
                <VStack flex={1} className="bg-background-0 pt-3">
                    <HStack className="mb-3 items-center justify-between px-4">
                        <Text className="font-semibold text-typography-500" size="sm">
                            {selectedDate}
                        </Text>
                        {isLoading ? (
                            <HStack space="xs" className="items-center">
                                <ActivityIndicator size="small" color="#007AFF" />
                                <Text className="text-typography-400" size="xs">
                                    {t('explore.loading')}
                                </Text>
                            </HStack>
                        ) : (
                            <Text className="text-typography-400" size="sm">
                                {events.length > 0 ? `${t('explore.event')} ${events.length}` : t('explore.noEvent')}
                            </Text>
                        )}
                    </HStack>
                    <FlatList
                        data={events}
                        renderItem={renderEvent}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={
                            !isLoading ? (
                                <Box className="items-center justify-center py-12">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={48}
                                        color={isDark ? '#404040' : '#D4D4D4'}
                                    />
                                    <Text className="mt-3 text-typography-400" size="md">
                                        {t('explore.noEvent')}
                                    </Text>
                                </Box>
                            ) : null
                        }
                    />
                </VStack>
            </VStack>

            {/* FAB: Add Event */}
            {hasPermission && (
                <TouchableOpacity
                    onPress={openAddEventModal}
                    activeOpacity={0.85}
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        right: 20,
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#007AFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#007AFF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.35,
                        shadowRadius: 8,
                        elevation: 6,
                    }}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            )}
            {/* Event Creation Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <Box
                        className={`w-full rounded-t-3xl p-6 ${isDark ? 'bg-background-100' : 'bg-background-0'}`}
                        style={{ maxHeight: '80%' }}>
                        <HStack justifyContent="space-between" alignItems="center" marginBottom={4}>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-2">
                                <Text className="text-typography-500" size="md">
                                    {t('explore.cancel')}
                                </Text>
                            </TouchableOpacity>
                            <Text className="font-bold text-typography-900" size="lg">
                                {t('explore.createEvent')}
                            </Text>
                            <TouchableOpacity onPress={submitNewEvent} className="p-2">
                                <Text className="font-bold text-[#007AFF]" size="md">
                                    {t('explore.save')}
                                </Text>
                            </TouchableOpacity>
                        </HStack>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            <VStack space="md" marginTop={2}>
                                {/* Title */}
                                <Box
                                    className={`rounded-xl border px-4 py-2 ${isDark ? 'border-outline-800 bg-background-200' : 'border-outline-200 bg-background-50'}`}>
                                    <TextInput
                                        placeholder={t('explore.eventTitlePlaceholder')}
                                        placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
                                        value={newEventTitle}
                                        onChangeText={setNewEventTitle}
                                        style={{
                                            color: isDark ? '#F5F5F5' : '#1A1A1A',
                                            fontSize: 16,
                                            paddingVertical: 10,
                                        }}
                                    />
                                </Box>

                                {/* Start Time */}
                                <HStack
                                    className={`items-center justify-between rounded-xl border px-4 py-3 ${isDark ? 'border-outline-800 bg-background-200' : 'border-outline-200 bg-background-50'}`}>
                                    <Text className="font-medium text-typography-700">{t('explore.startTime')}</Text>
                                    <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                                        <Text className="font-semibold text-[#007AFF]">
                                            {formatTime(newEventStartTime)}
                                        </Text>
                                    </TouchableOpacity>
                                    {(showStartTimePicker || Platform.OS === 'ios') && (
                                        <DateTimePicker
                                            value={newEventStartTime}
                                            mode="time"
                                            display="default"
                                            onChange={(event, date) => {
                                                if (Platform.OS === 'android') setShowStartTimePicker(false);
                                                if (date) setNewEventStartTime(date);
                                            }}
                                            textColor={isDark ? '#FFFFFF' : '#000000'}
                                        />
                                    )}
                                </HStack>

                                {/* End Time */}
                                <HStack
                                    className={`items-center justify-between rounded-xl border px-4 py-3 ${isDark ? 'border-outline-800 bg-background-200' : 'border-outline-200 bg-background-50'}`}>
                                    <Text className="font-medium text-typography-700">{t('explore.endTime')}</Text>
                                    <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                                        <Text className="font-semibold text-[#007AFF]">
                                            {formatTime(newEventEndTime)}
                                        </Text>
                                    </TouchableOpacity>
                                    {(showEndTimePicker || Platform.OS === 'ios') && (
                                        <DateTimePicker
                                            value={newEventEndTime}
                                            mode="time"
                                            display="default"
                                            onChange={(event, date) => {
                                                if (Platform.OS === 'android') setShowEndTimePicker(false);
                                                if (date) setNewEventEndTime(date);
                                            }}
                                            textColor={isDark ? '#FFFFFF' : '#000000'}
                                        />
                                    )}
                                </HStack>

                                {/* Location */}
                                <Box
                                    className={`rounded-xl border px-4 py-2 ${isDark ? 'border-outline-800 bg-background-200' : 'border-outline-200 bg-background-50'}`}>
                                    <TextInput
                                        placeholder={t('explore.locationPlaceholder')}
                                        placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
                                        value={newEventLocation}
                                        onChangeText={setNewEventLocation}
                                        style={{
                                            color: isDark ? '#F5F5F5' : '#1A1A1A',
                                            fontSize: 15,
                                            paddingVertical: 10,
                                        }}
                                    />
                                </Box>

                                {/* Notes */}
                                <Box
                                    className={`rounded-xl border px-4 py-2 ${isDark ? 'border-outline-800 bg-background-200' : 'border-outline-200 bg-background-50'}`}>
                                    <TextInput
                                        placeholder={t('explore.notesPlaceholder')}
                                        placeholderTextColor={isDark ? '#737373' : '#9CA3AF'}
                                        value={newEventNotes}
                                        onChangeText={setNewEventNotes}
                                        multiline
                                        numberOfLines={4}
                                        style={{
                                            color: isDark ? '#F5F5F5' : '#1A1A1A',
                                            fontSize: 15,
                                            minHeight: 80,
                                            textAlignVertical: 'top',
                                            paddingTop: 10,
                                        }}
                                    />
                                </Box>
                            </VStack>
                        </ScrollView>
                    </Box>
                </KeyboardAvoidingView>
            </Modal>
        </Box>
    );
};

export default CalendarScreen;
