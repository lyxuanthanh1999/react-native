import * as ExpoCalendar from 'expo-calendar';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface CalendarEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    calendarId: string;
    notes?: string;
    location?: string;
}

export const useExpoCalendar = (selectedDate: string) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [allEvents, setAllEvents] = useState<Record<string, CalendarEvent[]>>({});
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Request Permission ────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // ─── Load Events ───────────────────────────────────────────────────
    const loadEventsForMonth = useCallback(
        async (dateString: string) => {
            if (!hasPermission) return;
            setIsLoading(true);

            try {
                const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
                const calendarIds = calendars.map((c) => c.id);

                const centerDate = new Date(dateString);
                const startDate = new Date(centerDate);
                startDate.setMonth(startDate.getMonth() - 1);
                startDate.setDate(1);

                const endDate = new Date(centerDate);
                endDate.setMonth(endDate.getMonth() + 2);
                endDate.setDate(0);

                const rawEvents = await ExpoCalendar.getEventsAsync(calendarIds, startDate, endDate);

                const grouped: Record<string, CalendarEvent[]> = {};
                rawEvents.forEach((event) => {
                    const eventDate = new Date(event.startDate).toISOString().split('T')[0];
                    if (!grouped[eventDate]) grouped[eventDate] = [];
                    grouped[eventDate].push({
                        id: event.id,
                        title: event.title,
                        startDate: new Date(event.startDate),
                        endDate: new Date(event.endDate),
                        allDay: event.allDay || false,
                        calendarId: event.calendarId,
                        notes: event.notes || undefined,
                        location: event.location || undefined,
                    });
                });

                setAllEvents((prev) => ({ ...prev, ...grouped }));
            } catch (error) {
                console.warn('Failed to load calendar events:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [hasPermission]
    );

    // ─── Sync selected date events ─────────────────────────────────────
    useEffect(() => {
        setEvents(allEvents[selectedDate] || []);
    }, [selectedDate, allEvents]);

    // ─── Create Event Helper ───────────────────────────────────────────
    const getDefaultCalendarSource = async () => {
        const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    };

    const createEvent = useCallback(
        async (eventData: Partial<ExpoCalendar.Event>) => {
            if (!hasPermission) return false;

            try {
                const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
                let defaultCalendar =
                    calendars.find((c) => c.isPrimary && c.allowsModifications) ||
                    calendars.find((c) => c.allowsModifications);

                if (!defaultCalendar) {
                    const defaultCalendarSource =
                        Platform.OS === 'ios'
                            ? await getDefaultCalendarSource()
                            : { isLocalAccount: true, name: 'DS Rewards', type: ExpoCalendar.SourceType.LOCAL };

                    const newCalendarID = await ExpoCalendar.createCalendarAsync({
                        title: 'DS Rewards Events',
                        color: '#007AFF',
                        entityType: ExpoCalendar.EntityTypes.EVENT,
                        sourceId: defaultCalendarSource.id,
                        source: defaultCalendarSource,
                        name: 'internalCalendarName',
                        ownerAccount: 'personal',
                        accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
                    });

                    defaultCalendar = (await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT)).find(
                        (c) => c.id === newCalendarID
                    );
                }

                if (!defaultCalendar) {
                    throw new Error('No writable calendar found');
                }

                await ExpoCalendar.createEventAsync(defaultCalendar.id, eventData);
                await loadEventsForMonth(selectedDate);
                return true;
            } catch (error) {
                console.warn('Failed to create event:', error);
                throw error;
            }
        },
        [hasPermission, selectedDate, loadEventsForMonth]
    );

    return {
        events,
        allEvents,
        hasPermission,
        isLoading,
        loadEventsForMonth,
        createEvent,
    };
};
