import { create } from 'zustand';
import api from '../lib/api';
import { CalendarEvent, CalendarEventType, CalendarEventPriority } from '../types';

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CalendarState {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  companyUsers: CompanyUser[];
  selectedUserId: string | null;
  myEventsOnly: boolean;
  isLoading: boolean;
  error: string | null;
  fetchEvents: (filters?: any) => Promise<void>;
  getEvent: (id: string) => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  completeEvent: (id: string) => Promise<void>;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
  setSelectedUserId: (userId: string | null) => void;
  setMyEventsOnly: (myEventsOnly: boolean) => void;
  fetchCompanyUsers: () => Promise<void>;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getUpcomingEvents: (days?: number) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  selectedEvent: null,
  currentDate: new Date(),
  viewMode: 'month',
  companyUsers: [],
  selectedUserId: null,
  myEventsOnly: false,
  isLoading: false,
  error: null,

  fetchEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { selectedUserId, myEventsOnly } = get();
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      if (myEventsOnly) {
        params.append('myEventsOnly', 'true');
      } else if (selectedUserId) {
        params.append('userId', selectedUserId);
      }

      const response = await api.get(`/calendar/events?${params.toString()}`);
      set({ events: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch calendar events', 
        isLoading: false 
      });
    }
  },

  getEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/calendar/events/${id}`);
      set({ selectedEvent: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch event details', 
        isLoading: false 
      });
    }
  },

  addEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/calendar/events', eventData);
      set(state => ({ 
        events: [...state.events, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create event', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/calendar/events/${id}`, updates);
      set(state => {
        const updatedEvents = state.events.map(event => 
          event.id === id ? response.data : event
        );
        
        return { 
          events: updatedEvents,
          selectedEvent: state.selectedEvent?.id === id 
            ? response.data
            : state.selectedEvent,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update event', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/calendar/events/${id}`);
      set(state => ({ 
        events: state.events.filter(event => event.id !== id),
        selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete event', 
        isLoading: false 
      });
      throw error;
    }
  },

  completeEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/calendar/events/${id}/complete`);
      set(state => {
        const updatedEvents = state.events.map(event => 
          event.id === id ? { ...event, isCompleted: true, completedAt: response.data.completedAt } : event
        );
        
        return { 
          events: updatedEvents,
          selectedEvent: state.selectedEvent?.id === id 
            ? { ...state.selectedEvent, isCompleted: true, completedAt: response.data.completedAt }
            : state.selectedEvent,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to complete event', 
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },

  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => {
    set({ viewMode: mode });
  },

  setSelectedUserId: (userId: string | null) => {
    set({ selectedUserId: userId, myEventsOnly: false });
    // Automatically refresh events when user filter changes
    get().fetchEvents();
  },

  setMyEventsOnly: (myEventsOnly: boolean) => {
    set({ myEventsOnly, selectedUserId: null });
    // Automatically refresh events when filter changes
    get().fetchEvents();
  },

  fetchCompanyUsers: async () => {
    try {
      const response = await api.get('/calendar/users');
      set({ companyUsers: response.data });
    } catch (error: any) {
      console.error('Failed to fetch company users:', error);
    }
  },

  getEventsForDate: (date: Date) => {
    const { events } = get();
    const targetDate = date.toISOString().split('T')[0];
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime).toISOString().split('T')[0];
      return eventDate === targetDate;
    });
  },

  getUpcomingEvents: (days = 7) => {
    const { events } = get();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate >= now && eventDate <= futureDate && !event.isCompleted;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }
}));