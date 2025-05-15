import React, { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import EmployeeFormModal from './components/EmployeeFormModal';

const EmployeesPage = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your company's employees and their access levels
          </p>
        </div>
        {user?.role === 'admin' && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Employee list will be added here */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <p className="text-slate-600">Employee list will be displayed here</p>
        </div>
      </div>

      <EmployeeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EmployeesPage;