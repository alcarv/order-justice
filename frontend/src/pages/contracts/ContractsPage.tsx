import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, DollarSign, Calendar, Filter } from 'lucide-react';
import { useContractsStore } from '../../stores/contractsStore';
import { useClientsStore } from '../../stores/clientsStore';
import { Contract, ContractStatus, ContractType } from '../../types';
import ContractCard from './components/ContractCard';
import ContractFormModal from './components/ContractFormModal';

const ContractsPage = () => {
  const { contracts, contractStats, fetchContracts, fetchContractStats, isLoading } = useContractsStore();
  const { clients, fetchClients } = useClientsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    clientId: '',
    status: '',
    contractType: ''
  });

  useEffect(() => {
    fetchContracts();
    fetchContractStats();
    fetchClients();
  }, [fetchContracts, fetchContractStats, fetchClients]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchContracts(newFilters);
  };

  const clearFilters = () => {
    setFilters({ clientId: '', status: '', contractType: '' });
    fetchContracts();
  };

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Contracts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage legal contracts and agreements
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {contractStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Total Contracts</p>
                <p className="text-lg font-semibold text-slate-900">{contractStats.totalContracts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Active Contracts</p>
                <p className="text-lg font-semibold text-slate-900">{contractStats.activeContracts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Total Value</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${contractStats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-amber-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${contractStats.pendingPayments.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search contracts by title, number, or client"
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={filters.clientId}
              onChange={(e) => handleFilterChange('clientId', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={filters.contractType}
              onChange={(e) => handleFilterChange('contractType', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="service">Service</option>
              <option value="retainer">Retainer</option>
              <option value="contingency">Contingency</option>
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed</option>
            </select>

            {(filters.clientId || filters.status || filters.contractType) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-600">Loading contracts...</p>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg px-8 py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900">No contracts found</h3>
          {searchTerm || filters.clientId || filters.status || filters.contractType ? (
            <p className="mt-1 text-sm text-slate-500">
              No contracts match your search criteria. Try adjusting your filters or search term.
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">
              Get started by creating your first contract.
            </p>
          )}
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}

      {/* Contract Form Modal */}
      <ContractFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ContractsPage;