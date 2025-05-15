import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClientsStore } from '../../stores/clientsStore';
import ClientFactsSection from './components/ClientFactsSection';
import ClientServicesSection from './components/ClientServicesSection';

const ClientDetailsPage = () => {
  const { id } = useParams();
  const { selectedClient, getClient, isLoading } = useClientsStore();

  useEffect(() => {
    if (id) {
      getClient(id);
    }
  }, [id, getClient]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-slate-600">Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          {selectedClient.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Client Details and History
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Email</label>
                <p className="text-sm text-slate-900">{selectedClient.email}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Phone</label>
                <p className="text-sm text-slate-900">{selectedClient.phone}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Address</label>
                <p className="text-sm text-slate-900">{selectedClient.address}</p>
              </div>
              {selectedClient.taxId && (
                <div>
                  <label className="text-xs text-slate-500">Tax ID</label>
                  <p className="text-sm text-slate-900">{selectedClient.taxId}</p>
                </div>
              )}
              {selectedClient.notes && (
                <div>
                  <label className="text-xs text-slate-500">Notes</label>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services and Facts */}
        <div className="lg:col-span-2 space-y-6">
          <ClientServicesSection clientId={selectedClient.id} />
          <ClientFactsSection clientId={selectedClient.id} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;