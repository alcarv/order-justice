import { create } from 'zustand';
import api from '../lib/api';

interface CompanyUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface userState {
    companyUsers: CompanyUser[];
    error: string | null;
    fetchCompanyUsers: () => Promise<void>;
}

export const useUsersStore = create<userState>((set, get) => ({
      companyUsers: [],
      error: null,

    fetchCompanyUsers: async () => {
        try {
            const response = await api.get('/users/company');
            set({ companyUsers: response.data });
        } catch (error: any) {
            console.error('Failed to fetch company users:', error);
        }
    },
}))