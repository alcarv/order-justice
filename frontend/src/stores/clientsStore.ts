import { create } from 'zustand';
import api from '../lib/api';
import { Client } from '../types';

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  getClient: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'processes'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/clients');
      set({ clients: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch clients', 
        isLoading: false 
      });
    }
  },
  
  getClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/clients/${id}`);
      set({ selectedClient: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch client details', 
        isLoading: false 
      });
    }
  },
  
  addClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/clients', clientData);
      const newClient = { ...response.data, processes: [] }; // Initialize with empty processes array
      set(state => ({ 
        clients: [...state.clients, newClient],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add client', 
        isLoading: false 
      });
    }
  },
  
  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/clients/${id}`, updates);
      set(state => {
        const updatedClients = state.clients.map(client => 
          client.id === id ? response.data : client
        );
        
        return { 
          clients: updatedClients,
          selectedClient: state.selectedClient?.id === id 
            ? response.data
            : state.selectedClient,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update client', 
        isLoading: false 
      });
    }
  },
  
  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/clients/${id}`);
      set(state => ({ 
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete client', 
        isLoading: false 
      });
    }
  },
}));
