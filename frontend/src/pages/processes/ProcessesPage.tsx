import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { useProcessesStore } from '../../stores/processesStore';
import ProcessFormModal from './components/ProcessFormModal';
import ProcessList from './components/ProcessList';

const ProcessesPage = () => {
  const { processes, fetchProcesses, isLoading } = useProcessesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  const filteredProcesses = processes.filter(process =>
    process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Legal Processes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and track all legal processes
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Process
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or case number"
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Process list */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-600">Loading processes...</p>
        </div>
      ) : filteredProcesses.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg px-8 py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900">No processes found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first legal process.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </button>
          </div>
        </div>
      ) : (
        <ProcessList processes={filteredProcesses} />
      )}

      <ProcessFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProcessesPage;