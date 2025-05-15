import { create } from 'zustand';
import api from '../lib/api';
import { ClientFact } from '../types';

interface FactsState {
  facts: ClientFact[];
  isLoading: boolean;
  error: string | null;
  fetchClientFacts: (clientId: string) => Promise<void>;
  addFact: (fact: Omit<ClientFact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFact: (factId: string, content: string) => Promise<void>;
  linkFactToProcess: (factId: string, processId: string) => Promise<void>;
}

export const useFactsStore = create<FactsState>((set, get) => ({
  facts: [],
  isLoading: false,
  error: null,

  fetchClientFacts: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/facts/client/${clientId}`);
      set({ facts: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch client facts', 
        isLoading: false 
      });
    }
  },

  addFact: async (factData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/facts', factData);
      set(state => ({
        facts: [data, ...state.facts],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add fact', 
        isLoading: false 
      });
    }
  },

  updateFact: async (factId: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch(`/facts/${factId}`, { content });
      set(state => ({
        facts: state.facts.map(fact =>
          fact.id === factId ? { ...fact, content } : fact
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update fact', 
        isLoading: false 
      });
    }
  },

  linkFactToProcess: async (factId: string, processId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch(`/facts/${factId}/link-process`, { processId });
      set(state => ({
        facts: state.facts.map(fact =>
          fact.id === factId ? { ...fact, processId } : fact
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to link fact to process', 
        isLoading: false 
      });
    }
  }
}));