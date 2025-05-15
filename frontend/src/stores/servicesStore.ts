import { create } from 'zustand';
import api from '../lib/api';
import { Service, ClientService } from '../types';

interface ServicesState {
  services: Service[];
  clientServices: ClientService[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchClientServices: (clientId: string) => Promise<void>;
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  startService: (clientId: string, serviceId: string, assignedTo: string) => Promise<void>;
  updateServiceStatus: (serviceId: string, status: ClientService['status']) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  clientServices: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/services');
      set({ services: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },

  fetchClientServices: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/services/client/${clientId}`);
      set({ clientServices: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch client services', 
        isLoading: false 
      });
    }
  },

  addService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/services', serviceData);
      set(state => ({
        services: [...state.services, data],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add service', 
        isLoading: false 
      });
    }
  },

  startService: async (clientId: string, serviceId: string, assignedTo: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/services/start', {
        clientId,
        serviceId,
        assignedTo
      });
      set(state => ({
        clientServices: [...state.clientServices, data],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to start service', 
        isLoading: false 
      });
    }
  },

  updateServiceStatus: async (serviceId: string, status: ClientService['status']) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch(`/services/${serviceId}/status`, { status });
      set(state => ({
        clientServices: state.clientServices.map(service =>
          service.id === serviceId ? { ...service, ...data } : service
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update service status', 
        isLoading: false 
      });
    }
  }
}));