import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, DollarSign, Calendar, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Contract, ContractStatus } from '../../../types';

interface ContractCardProps {
  contract: Contract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'retainer': return 'bg-purple-100 text-purple-800';
      case 'contingency': return 'bg-green-100 text-green-800';
      case 'hourly': return 'bg-orange-100 text-orange-800';
      case 'fixed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = contract.values?.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.amount, 0) || 0;
  const totalPending = contract.values?.filter(v => v.status === 'pending').reduce((sum, v) => sum + v.amount, 0) || 0;

  return (
    <Link
      to={`/contracts/${contract.id}`}
      className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 line-clamp-1">
              {contract.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {contract.contractNumber}
            </p>
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.contractType)}`}>
              {contract.contractType}
            </span>
          </div>
        </div>

        {contract.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {contract.description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <User className="h-4 w-4 mr-2 text-slate-400" />
            <span>{contract.client?.name || 'Unknown Client'}</span>
          </div>

          <div className="flex items-center text-sm text-slate-600">
            <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
            <span className="font-medium">
              ${contract.totalValue.toLocaleString()} {contract.currency}
            </span>
          </div>

          {contract.values && contract.values.length > 0 && (
            <div className="text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Paid: ${totalPaid.toLocaleString()}</span>
                <span>Pending: ${totalPending.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${(totalPaid / contract.totalValue) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(contract.startDate), 'MMM d, yyyy')}</span>
            </div>
            {contract.endDate && (
              <div className="flex items-center">
                <span>to {format(new Date(contract.endDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>

          {contract.process && (
            <div className="flex items-center text-sm text-slate-600">
              <Building className="h-4 w-4 mr-2 text-slate-400" />
              <span className="truncate">Linked to process</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 text-right">
        <span className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
          View details →
        </span>
      </div>
    </Link>
  );
};

export default ContractCard;