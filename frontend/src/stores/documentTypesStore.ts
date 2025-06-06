import { create } from 'zustand';
import api from '../lib/api';
import { DocumentType } from '../types';

interface DocumentTypeItem {
  id: string;
  type: DocumentType;
  label: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DocumentTypesState {
  documentTypes: DocumentTypeItem[];
  isLoading: boolean;
  error: string | null;
  fetchDocumentTypes: () => Promise<void>;
  addDocumentType: (documentType: Omit<DocumentTypeItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDocumentType: (id: string, updates: Partial<DocumentTypeItem>) => Promise<void>;
  deleteDocumentType: (id: string) => Promise<void>;
}

export const useDocumentTypesStore = create<DocumentTypesState>((set) => ({
  documentTypes: [],
  isLoading: false,
  error: null,

  fetchDocumentTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/document-types');
      set({ documentTypes: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch document types', 
        isLoading: false 
      });
    }
  },

  addDocumentType: async (documentTypeData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/document-types', documentTypeData);
      set(state => ({
        documentTypes: [...state.documentTypes, data],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add document type', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateDocumentType: async (id: string, updates: Partial<DocumentTypeItem>) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/document-types/${id}`, updates);
      set(state => ({
        documentTypes: state.documentTypes.map(docType =>
          docType.id === id ? data : docType
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update document type', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteDocumentType: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/document-types/${id}`);
      set(state => ({
        documentTypes: state.documentTypes.filter(docType => docType.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete document type', 
        isLoading: false 
      });
      throw error;
    }
  }
}));