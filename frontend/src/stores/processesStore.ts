import { create } from 'zustand';
import { Process, Activity } from '../types';

interface ProcessesState {
  processes: Process[];
  selectedProcess: Process | null;
  isLoading: boolean;
  error: string | null;
  fetchProcesses: () => Promise<void>;
  getProcess: (id: string) => Promise<void>;
  addProcess: (process: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'activities' | 'documents'>) => Promise<void>;
  updateProcess: (id: string, updates: Partial<Process>) => Promise<void>;
  deleteProcess: (id: string) => Promise<void>;
  addActivity: (processId: string, activity: Omit<Activity, 'id' | 'processId' | 'createdAt'>) => Promise<void>;
}

// Mock process data
const mockProcesses: Process[] = [
  {
    id: '1',
    title: 'Corporate Restructuring',
    description: 'Legal assistance for corporate restructuring and asset reorganization.',
    clientId: '1',
    status: 'in_progress',
    priority: 'high',
    assignedTo: ['1', '3'],
    createdBy: '1',
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-10-15T14:20:00Z',
    dueDate: '2023-12-31T23:59:59Z',
    court: 'State Commercial Court',
    caseNumber: 'CC-2023-78954',
    documents: [
      {
        id: 'd1',
        name: 'Initial Assessment',
        processId: '1',
        fileUrl: '/documents/d1.pdf',
        fileType: 'application/pdf',
        uploadedBy: '1',
        uploadedAt: '2023-06-10T10:15:00Z',
      }
    ],
    activities: [
      {
        id: 'a1',
        processId: '1',
        type: 'status_change',
        description: 'Case status changed from pending to in_progress',
        createdBy: '1',
        createdAt: '2023-06-15T11:30:00Z',
      }
    ],
  },
  {
    id: '2',
    title: 'Divorce Proceedings',
    description: 'Representation in divorce case with property division.',
    clientId: '2',
    status: 'waiting_court',
    priority: 'medium',
    assignedTo: ['2'],
    createdBy: '1',
    createdAt: '2023-07-05T08:45:00Z',
    updatedAt: '2023-09-20T16:10:00Z',
    dueDate: '2024-01-15T23:59:59Z',
    court: 'Family Court',
    caseNumber: 'FC-2023-45678',
    documents: [],
    activities: [],
  },
  {
    id: '3',
    title: 'Intellectual Property Dispute',
    description: 'Patent infringement case against competitor.',
    clientId: '1',
    status: 'waiting_document',
    priority: 'urgent',
    assignedTo: ['1', '4'],
    createdBy: '1',
    createdAt: '2023-08-17T13:20:00Z',
    updatedAt: '2023-10-10T09:45:00Z',
    court: 'Federal District Court',
    caseNumber: 'IP-2023-98765',
    documents: [],
    activities: [],
  },
  {
    id: '4',
    title: 'International Contract Negotiation',
    description: 'Legal advisory for international business contract.',
    clientId: '3',
    status: 'pending',
    priority: 'high',
    assignedTo: ['2', '3'],
    createdBy: '2',
    createdAt: '2023-09-05T10:00:00Z',
    updatedAt: '2023-10-01T15:30:00Z',
    documents: [],
    activities: [],
  },
];

export const useProcessesStore = create<ProcessesState>((set, get) => ({
  processes: [],
  selectedProcess: null,
  isLoading: false,
  error: null,
  
  fetchProcesses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ processes: mockProcesses, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch processes', isLoading: false });
    }
  },
  
  getProcess: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const process = mockProcesses.find(p => p.id === id) || null;
      set({ selectedProcess: process, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch process details', isLoading: false });
    }
  },
  
  addProcess: async (processData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProcess: Process = {
        ...processData,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
        activities: [
          {
            id: `a${Date.now()}`,
            processId: `${Date.now()}`,
            type: 'status_change',
            description: `Process created with status ${processData.status}`,
            createdBy: processData.createdBy,
            createdAt: new Date().toISOString(),
          }
        ],
      };
      
      set(state => ({ 
        processes: [...state.processes, newProcess],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to add process', isLoading: false });
    }
  },
  
  updateProcess: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => {
        const updatedProcesses = state.processes.map(process => 
          process.id === id 
            ? { ...process, ...updates, updatedAt: new Date().toISOString() } 
            : process
        );
        
        return { 
          processes: updatedProcesses,
          selectedProcess: state.selectedProcess?.id === id 
            ? { ...state.selectedProcess, ...updates, updatedAt: new Date().toISOString() } 
            : state.selectedProcess,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: 'Failed to update process', isLoading: false });
    }
  },
  
  deleteProcess: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({ 
        processes: state.processes.filter(process => process.id !== id),
        selectedProcess: state.selectedProcess?.id === id ? null : state.selectedProcess,
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to delete process', isLoading: false });
    }
  },
  
  addActivity: async (processId, activityData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newActivity: Activity = {
        ...activityData,
        id: `a${Date.now()}`,
        processId,
        createdAt: new Date().toISOString(),
      };
      
      set(state => {
        const updatedProcesses = state.processes.map(process => {
          if (process.id === processId) {
            return {
              ...process,
              activities: [...process.activities, newActivity],
              updatedAt: new Date().toISOString()
            };
          }
          return process;
        });
        
        const updatedSelectedProcess = state.selectedProcess?.id === processId
          ? {
              ...state.selectedProcess,
              activities: [...state.selectedProcess.activities, newActivity],
              updatedAt: new Date().toISOString()
            }
          : state.selectedProcess;
        
        return {
          processes: updatedProcesses,
          selectedProcess: updatedSelectedProcess,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to add activity', isLoading: false });
    }
  }
}));