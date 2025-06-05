import { create } from 'zustand';
import api from '../lib/api';
import { ClientFact, ApiClientFact } from '../types';

interface FactsState {
  facts: ClientFact[];
  isLoading: boolean;
  error: string | null;
  fetchClientFacts: (clientId: string) => Promise<void>;
  addFact: (fact: Omit<ClientFact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFact: (factId: string, content: string) => Promise<void>;
  linkFactToProcess: (factId: string, processId: string) => Promise<void>;
  deleteFact: (factId: string) => Promise<void>;
}

function normalizeFact(item: ApiClientFact): ClientFact {
  return {
    id: item.id,
    clientId: item.client.id,
    reportedBy: item.reportedBy.id,
    content: item.content,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    processId: item.process?.id,
  };
}

export const useFactsStore = create<FactsState>((set, get) => ({
  facts: [],
  isLoading: false,
  error: null,

  fetchClientFacts: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/facts/client/${clientId}`);
      set({ facts: data.map(normalizeFact), isLoading: false });
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
      const newFact = normalizeFact(data); // ✅ normaliza
      set(state => ({
        facts: [newFact, ...state.facts],
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

  deleteFact: async (factId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/facts/${factId}`);
      set(state => ({
        facts: state.facts.filter(fact => fact.id !== factId),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete fact', 
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