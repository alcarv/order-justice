import { create } from 'zustand';
import api from '../lib/api';
import { User } from '../types';

interface LicenseInfo {
  licenseLimit: number;
  licenseUsed: number;
  activeSessions: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    lastActivity: string;
    ipAddress?: string;
  }>;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  licenseInfo: LicenseInfo | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  fetchLicenseInfo: () => Promise<void>;
  forceLogoutUser: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  licenseInfo: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, access_token, session_token } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('sessionToken', session_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['x-session-token'] = session_token;
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });

      get().fetchLicenseInfo();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw new Error(errorMessage);
    }
  },
  
  logout: async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['x-session-token'];
      set({ user: null, isAuthenticated: false, licenseInfo: null });
    }
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const sessionToken = localStorage.getItem('sessionToken');
    const userJson = localStorage.getItem('user');
    
    if (token && sessionToken && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        api.defaults.headers.common['x-session-token'] = sessionToken;
        set({ user, isAuthenticated: true });
        
        get().fetchLicenseInfo();
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
      }
    }
  },

  fetchLicenseInfo: async () => {
    try {
      const response = await api.get('/auth/license-info');
      set({ licenseInfo: response.data });
    } catch (error) {
      console.error('Failed to fetch license info:', error);
    }
  },

  forceLogoutUser: async (userId: string) => {
    try {
      await api.delete(`/auth/force-logout/${userId}`);
      get().fetchLicenseInfo();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to logout user');
    }
  }
}));