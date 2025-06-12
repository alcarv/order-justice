import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useContractsStore } from '../../../stores/contractsStore';
import { useClientsStore } from '../../../stores/clientsStore';
import { useProcessesStore } from '../../../stores/processesStore';
import { useAuthStore } from '../../../stores/authStore';
import { Contract, ContractStatus, ContractType } from '../../../types';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract?: Contract;
}

const ContractFormModal: React.FC<ContractFormModalProps> = ({
  isOpen,
  onClose,
  contract
}) => {
  const { addContract, updateContract, isLoading } = useContractsStore();
  const { clients, fetchClients } = useClientsStore();
  const { processes, fetchProcesses } = useProcessesStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: contract?.title || '',
    description: contract?.description || '',
    clientId: contract?.clientId || '',
    processId: contract?.processId || '',
    status: contract?.status || 'draft' as ContractStatus,
    contractType: contract?.contractType || 'service' as ContractType,
    totalValue: contract?.totalValue || 0,
    currency: contract?.currency || 'USD',
    startDate: contract?.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
    endDate: contract?.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
    termsAndConditions: contract?.termsAndConditions || '',
    notes: contract?.notes || '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchProcesses();
    }
  }, [isOpen, fetchClients, fetchProcesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const contractData = {
        ...formData,
        createdBy: user.id,
      };

      if (contract?.id) {
        await updateContract(contract.id, contractData);
      } else {
        await addContract(contractData);
      }

      onClose();
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'totalValue' ? parseFloat(value) || 0 : value 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">
              {contract ? 'Edit Contract' : 'New Contract'}
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
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    Contract Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="e.g., Legal Services Agreement"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-slate-700">
                      Client *
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      required
                      value={formData.clientId}
                      onChange={handleChange}
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
                    <label htmlFor="processId" className="block text-sm font-medium text-slate-700">
                      Linked Process (Optional)
                    </label>
                    <select
                      id="processId"
                      name="processId"
                      value={formData.processId}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="">No linked process</option>
                      {processes.map(process => (
                        <option key={process.id} value={process.id}>
                          {process.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Brief description of the contract"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contractType" className="block text-sm font-medium text-slate-700">
                      Contract Type *
                    </label>
                    <select
                      id="contractType"
                      name="contractType"
                      required
                      value={formData.contractType}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="service">Service</option>
                      <option value="retainer">Retainer</option>
                      <option value="contingency">Contingency</option>
                      <option value="hourly">Hourly</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="totalValue" className="block text-sm font-medium text-slate-700">
                      Total Value *
                    </label>
                    <input
                      type="number"
                      id="totalValue"
                      name="totalValue"
                      required
                      min="0"
                      step="0.01"
                      value={formData.totalValue}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-slate-700">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="BRL">BRL</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="termsAndConditions" className="block text-sm font-medium text-slate-700">
                    Terms and Conditions
                  </label>
                  <textarea
                    id="termsAndConditions"
                    name="termsAndConditions"
                    rows={4}
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Contract terms and conditions..."
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
              >
                {isLoading ? 'Saving...' : contract ? 'Update Contract' : 'Create Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractFormModal;