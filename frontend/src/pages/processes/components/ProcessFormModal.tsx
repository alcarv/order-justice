import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProcessesStore } from '../../../stores/processesStore';
import { useClientsStore } from '../../../stores/clientsStore';
import { useAuthStore } from '../../../stores/authStore';
import { Process, ProcessStatus, ProcessPriority } from '../../../types';

interface ProcessFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  process?: Process;
}

const ProcessFormModal: React.FC<ProcessFormModalProps> = ({
  isOpen,
  onClose,
  process
}) => {
  const { addProcess, updateProcess, isLoading } = useProcessesStore();
  const { clients, fetchClients } = useClientsStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: process?.title || '',
    description: process?.description || '',
    clientId: process?.clientId || '',
    status: process?.status || 'pending' as ProcessStatus,
    priority: process?.priority || 'medium' as ProcessPriority,
    court: process?.court || '',
    caseNumber: process?.caseNumber || '',
    dueDate: process?.dueDate ? new Date(process.dueDate).toISOString().split('T')[0] : '',
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const processData = {
      ...formData,
      assignedTo: [user.id],
      createdBy: user.id,
    };

    if (process?.id) {
      await updateProcess(process.id, processData);
    } else {
      await addProcess(processData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">
              {process ? 'Edit Process' : 'New Legal Process'}
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-slate-700">
                    Client *
                  </label>
                  <select
                    id="client"
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProcessStatus }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_client">Waiting for Client</option>
                      <option value="waiting_court">Waiting for Court</option>
                      <option value="waiting_document">Waiting for Document</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as ProcessPriority }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="court" className="block text-sm font-medium text-slate-700">
                      Court
                    </label>
                    <input
                      type="text"
                      id="court"
                      value={formData.court}
                      onChange={(e) => setFormData(prev => ({ ...prev, court: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="caseNumber" className="block text-sm font-medium text-slate-700">
                      Case Number
                    </label>
                    <input
                      type="text"
                      id="caseNumber"
                      value={formData.caseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
              >
                {isLoading ? 'Saving...' : process ? 'Update Process' : 'Create Process'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProcessFormModal;