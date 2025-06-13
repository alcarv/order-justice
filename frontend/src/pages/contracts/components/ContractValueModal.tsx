import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useContractsStore } from '../../../stores/contractsStore';
import { ContractValue, PaymentStatus } from '../../../types';

interface ContractValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  value?: ContractValue;
}

const ContractValueModal: React.FC<ContractValueModalProps> = ({
  isOpen,
  onClose,
  contractId,
  value
}) => {
  const { addContractValue, updateContractValue, isLoading } = useContractsStore();
  
  const [formData, setFormData] = useState({
    description: value?.description || '',
    amount: value?.amount || 0,
    dueDate: value?.dueDate ? new Date(value.dueDate).toISOString().split('T')[0] : '',
    paymentMethod: value?.paymentMethod || '',
    status: value?.status || 'pending' as PaymentStatus,
  });

  useEffect(() => {
    if (value) {
      setFormData({
        description: value.description,
        amount: value.amount,
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString().split('T')[0] : '',
        paymentMethod: value.paymentMethod || '',
        status: value.status,
      });
    } else {
      setFormData({
        description: '',
        amount: 0,
        dueDate: '',
        paymentMethod: '',
        status: 'pending',
      });
    }
  }, [value, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (value?.id) {
        await updateContractValue(value.id, formData);
      } else {
        await addContractValue(contractId, formData);
      }
      onClose();
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(inputValue) || 0 : inputValue 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">
              {value ? 'Edit Payment Entry' : 'Add Payment Entry'}
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
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description *
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="e.g., Initial payment, Monthly retainer"
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
                    Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="0.00"
                  />
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
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="e.g., Credit Card, Bank Transfer, Check"
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
                {isLoading ? 'Saving...' : value ? 'Update Payment' : 'Add Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractValueModal;