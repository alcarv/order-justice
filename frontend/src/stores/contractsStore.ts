import { create } from 'zustand';
import api from '../lib/api';
import { Contract, ContractValue, ContractDocument, ContractHistory } from '../types';

interface ContractsState {
  contracts: Contract[];
  selectedContract: Contract | null;
  contractStats: {
    totalContracts: number;
    activeContracts: number;
    totalValue: number;
    pendingPayments: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchContracts: (filters?: { clientId?: string; status?: string; contractType?: string }) => Promise<void>;
  getContract: (id: string) => Promise<void>;
  addContract: (contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt' | 'values' | 'history' | 'documents'>) => Promise<void>;
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  addContractValue: (contractId: string, value: Omit<ContractValue, 'id' | 'contractId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContractValue: (valueId: string, updates: Partial<ContractValue>) => Promise<void>;
  deleteContractValue: (valueId: string) => Promise<void>;
  uploadContractDocument: (contractId: string, file: File, info: { name: string; description?: string; documentType: string; tags?: string[] }) => Promise<void>;
  deleteContractDocument: (documentId: string) => Promise<void>;
  fetchContractStats: () => Promise<void>;
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  selectedContract: null,
  contractStats: null,
  isLoading: false,
  error: null,

  fetchContracts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.clientId) params.append('clientId', filters.clientId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.contractType) params.append('contractType', filters.contractType);

      const response = await api.get(`/contracts?${params.toString()}`);
      set({ contracts: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch contracts', 
        isLoading: false 
      });
    }
  },

  getContract: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/contracts/${id}`);
      set({ selectedContract: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch contract details', 
        isLoading: false 
      });
    }
  },

  addContract: async (contractData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/contracts', contractData);
      set(state => ({ 
        contracts: [...state.contracts, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create contract', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateContract: async (id: string, updates: Partial<Contract>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/contracts/${id}`, updates);
      set(state => {
        const updatedContracts = state.contracts.map(contract => 
          contract.id === id ? response.data : contract
        );
        
        return { 
          contracts: updatedContracts,
          selectedContract: state.selectedContract?.id === id 
            ? response.data
            : state.selectedContract,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update contract', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteContract: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/contracts/${id}`);
      set(state => ({ 
        contracts: state.contracts.filter(contract => contract.id !== id),
        selectedContract: state.selectedContract?.id === id ? null : state.selectedContract,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete contract', 
        isLoading: false 
      });
      throw error;
    }
  },

  addContractValue: async (contractId: string, valueData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/contracts/${contractId}/values`, valueData);
      
      if (get().selectedContract?.id === contractId) {
        await get().getContract(contractId);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add payment entry', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateContractValue: async (valueId: string, updates: Partial<ContractValue>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/contracts/values/${valueId}`, updates);
      
      if (get().selectedContract) {
        await get().getContract(get().selectedContract.id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update payment entry', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteContractValue: async (valueId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/contracts/values/${valueId}`);
      
      if (get().selectedContract) {
        await get().getContract(get().selectedContract.id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete payment entry', 
        isLoading: false 
      });
      throw error;
    }
  },

  uploadContractDocument: async (contractId: string, file: File, info) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', info.name);
      if (info.description) formData.append('description', info.description);
      formData.append('documentType', info.documentType);
      if (info.tags) formData.append('tags', JSON.stringify(info.tags));

      const response = await api.post(`/contracts/${contractId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (get().selectedContract?.id === contractId) {
        await get().getContract(contractId);
      }

      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload document', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteContractDocument: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/contracts/documents/${documentId}`);
      
      if (get().selectedContract) {
        await get().getContract(get().selectedContract.id);
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete document', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchContractStats: async () => {
    try {
      const response = await api.get('/contracts/stats');
      set({ contractStats: response.data });
    } catch (error: any) {
      console.error('Failed to fetch contract stats:', error);
    }
  }
}));