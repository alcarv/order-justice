import { create } from 'zustand';
import api from '../lib/api';
import { Process, Activity, Document } from '../types';

interface ProcessesState {
  processes: Process[];
  selectedProcess: Process | null;
  clientProcesses: Process[];
  isLoading: boolean;
  error: string | null;
  fetchProcesses: () => Promise<void>;
  getProcess: (id: string) => Promise<void>;
  addProcess: (process: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'activities' | 'documents'>) => Promise<void>;
  updateProcess: (id: string, updates: Partial<Process>) => Promise<void>;
  deleteProcess: (id: string) => Promise<void>;
  addActivity: (processId: string, activity: Omit<Activity, 'id' | 'processId' | 'createdAt'>) => Promise<void>;
  getProcessListByClientId: (processId: string) => Promise<void>;
  uploadDocument: (
    processId: string,
    file: File,
    info: { name: string; description?: string; tags?: string },
    onProgress?: (progress: number) => void
  ) => Promise<void>;
  documents: Document[];
}

export const useProcessesStore = create<ProcessesState>((set, get) => ({
  processes: [],
  selectedProcess: null,
  clientProcesses: [],
  documents: [],
  isLoading: false,
  error: null,
  
  fetchProcesses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/processes');
      set({ processes: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch processes', 
        isLoading: false 
      });
    }
  },
  
  getProcess: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/processes/${id}`);
      set({ selectedProcess: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch process details', 
        isLoading: false 
      });
    }
  },

  getProcessListByClientId: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/processes?clientId=${clientId}`);
      set({ clientProcesses: response.data, isLoading: false }); // ✅ correto agora
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch process details', 
        isLoading: false 
      });
    }
  },
  
  addProcess: async (processData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/processes', processData);
      set(state => ({ 
        processes: [...state.processes, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add process', 
        isLoading: false 
      });
    }
  },
  
  updateProcess: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/processes/${id}`, updates);
      set(state => {
        const updatedProcesses = state.processes.map(process => 
          process.id === id ? response.data : process
        );
        
        return { 
          processes: updatedProcesses,
          selectedProcess: state.selectedProcess?.id === id 
            ? response.data
            : state.selectedProcess,
          isLoading: false 
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update process', 
        isLoading: false 
      });
    }
  },
  
  deleteProcess: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/processes/${id}`);
      set(state => ({ 
        processes: state.processes.filter(process => process.id !== id),
        selectedProcess: state.selectedProcess?.id === id ? null : state.selectedProcess,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete process', 
        isLoading: false 
      });
    }
  },
  
  addActivity: async (processId, activityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/processes/${processId}/activities`, activityData);
      set(state => {
        const updatedProcesses = state.processes.map(process => {
          if (process.id === processId) {
            return {
              ...process,
              activities: [...process.activities, response.data]
            };
          }
          return process;
        });
        
        return {
          processes: updatedProcesses,
          selectedProcess: state.selectedProcess?.id === processId
            ? {
                ...state.selectedProcess,
                activities: [...state.selectedProcess.activities, response.data]
              }
            : state.selectedProcess,
          isLoading: false
        };
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add activity', 
        isLoading: false 
      });
    }
  },

  uploadDocument: async (processId, file, info, onProgress) => {
    set({ isLoading: true, error: null });
    try {
      // First, get a pre-signed URL from the backend
      const { data: { uploadUrl, fileUrl } } = await api.post('/processes/documents/upload-url', {
        fileName: file.name,
        fileType: file.type,
        processId
      });

      // Upload the file to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      // Create document record in the database
      const documentData = {
        processId,
        name: info.name,
        description: info.description,
        fileUrl,
        fileType: file.type,
        fileSize: file.size,
        tags: info.tags ? info.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await api.post('/processes/documents', documentData);

      // Update store
      set(state => ({
        documents: [...state.documents, response.data],
        processes: state.processes.map(process => {
          if (process.id === processId) {
            return {
              ...process,
              documents: [...process.documents, response.data]
            };
          }
          return process;
        }),
        selectedProcess: state.selectedProcess?.id === processId
          ? {
              ...state.selectedProcess,
              documents: [...state.selectedProcess.documents, response.data]
            }
          : state.selectedProcess,
        isLoading: false
      }));

      // Add activity for document upload
      await get().addActivity(processId, {
        type: 'document_added',
        description: `Document "${info.name}" was uploaded`,
        createdBy: response.data.uploadedBy
      });

    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload document', 
        isLoading: false 
      });
      throw error;
    }
  }
}));