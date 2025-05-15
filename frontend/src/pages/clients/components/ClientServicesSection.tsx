import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useServicesStore } from '../../../stores/servicesStore';
import { useAuthStore } from '../../../stores/authStore';
import { Service, ClientService } from '../../../types';

interface ClientServicesSectionProps {
  clientId: string;
}

const ClientServicesSection: React.FC<ClientServicesSectionProps> = ({ clientId }) => {
  const { user } = useAuthStore();
  const { services, clientServices, fetchServices, fetchClientServices, startService, updateServiceStatus } = useServicesStore();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    fetchServices();
    fetchClientServices(clientId);
  }, [clientId, fetchServices, fetchClientServices]);

  const handleStartService = async () => {
    if (!user || !selectedService) return;

    await startService(clientId, selectedService, user.id);
    setSelectedService('');
    setIsAdding(false);
  };

  const getStatusColor = (status: ClientService['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-slate-900">Services</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Start Service
          </button>
        </div>

        {isAdding && (
          <div className="mb-6 bg-slate-50 p-4 rounded-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700">
                  Select Service *
                </label>
                <select
                  id="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                >
                  <option value="">Choose a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartService}
                  disabled={!selectedService}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  Start Service
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {clientServices.map(service => {
            const serviceDetails = services.find(s => s.id === service.serviceId);
            if (!serviceDetails) return null;

            return (
              <div key={service.id} className="border border-slate-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">
                      {serviceDetails.title}
                    </h3>
                    {serviceDetails.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {serviceDetails.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        Started {format(new Date(service.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  {service.status !== 'completed' && service.status !== 'cancelled' && (
                    <div className="ml-4">
                      <select
                        className="text-xs border border-slate-300 rounded px-2 py-1"
                        value={service.status}
                        onChange={(e) => updateServiceStatus(service.id, e.target.value as ClientService['status'])}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientServicesSection;