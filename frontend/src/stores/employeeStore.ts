import { create } from 'zustand';
import api from '../lib/api';
import { User, UserRole } from '../types';

interface Employee extends Omit<User, 'id'> {
  id: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  currentSession?: {
    id: string;
    isActive: boolean;
    lastActivity: string;
  };
}

interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UpdateEmployeeData {
  name?: string;
  email?: string;
  role?: UserRole;
}

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  getEmployee: (id: string) => Promise<Employee>;
  addEmployee: (employee: CreateEmployeeData) => Promise<void>;
  updateEmployee: (id: string, updates: UpdateEmployeeData) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  toggleEmployeeStatus: (id: string) => Promise<void>;
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users');
      set({ employees: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch employees', 
        isLoading: false 
      });
    }
  },

  getEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/users/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch employee details', 
        isLoading: false 
      });
      throw error;
    }
  },

  addEmployee: async (employeeData: CreateEmployeeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users', employeeData);
      set(state => ({ 
        employees: [...state.employees, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add employee';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  },

  updateEmployee: async (id: string, updates: UpdateEmployeeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/users/${id}`, updates);
      set(state => {
        const updatedEmployees = state.employees.map(employee => 
          employee.id === id ? response.data : employee
        );
        
        return { 
          employees: updatedEmployees,
          isLoading: false 
        };
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/users/${id}`);
      set(state => ({ 
        employees: state.employees.filter(employee => employee.id !== id),
        isLoading: false 
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete employee';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  },

  toggleEmployeeStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/users/${id}/toggle-status`);
      set(state => {
        const updatedEmployees = state.employees.map(employee => 
          employee.id === id ? { ...employee, isActive: response.data.isActive } : employee
        );
        
        return { 
          employees: updatedEmployees,
          isLoading: false 
        };
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee status';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  }
}));