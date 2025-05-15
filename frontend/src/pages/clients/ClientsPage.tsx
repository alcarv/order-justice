import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, UserPlus } from 'lucide-react';
import { useClientsStore } from '../../stores/clientsStore';
import { Client } from '../../types';
import ClientCard from './components/ClientCard';
import ClientFormModal from './components/ClientFormModal';

const ClientsPage = () => {
  const { clients, fetchClients, isLoading } = useClientsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
  
  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Clients</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage all your clients and their information
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients by name, email or phone"
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Clients list */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-600">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg px-8 py-12 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900">No clients found</h3>
          {searchTerm ? (
            <p className="mt-1 text-sm text-slate-500">
              No clients match your search criteria. Try a different search or add a new client.
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">
              Get started by adding your first client.
            </p>
          )}
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
      
      {/* Client Form Modal */}
      <ClientFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ClientsPage;