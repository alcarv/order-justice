import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { useServicesStore } from '../../../stores/servicesStore';
import { useAuthStore } from '../../../stores/authStore';
import { Service, ClientService } from '../../../types';

interface ClientServicesSectionProps {
  clientId: string;
}

const ClientServicesSection: React.FC<ClientServicesSectionProps> = ({ clientId }) => {
  const { user } = useAuthStore();
  const { 
    services, 
    clientServices, 
    fetchServices, 
    fetchClientServices, 
    startService, 
    updateServiceStatus,
    deleteClientService 
  } = useServicesStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [editStatus, setEditStatus] = useState<ClientService['status']>('pending');

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

  const handleEditService = (service: ClientService) => {
    setEditingService(service);
    setEditStatus(service.status);
  };

  const handleUpdateStatus = async () => {
    if (!editingService) return;

    await updateServiceStatus(editingService.id, editStatus);
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to remove this service? This action cannot be undone.')) {
      await deleteClientService(serviceId);
    }
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

  const getStatusOptions = (): { value: ClientService['status']; label: string }[] => [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

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
                      {service.title} - ${service.price}
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
            if (!service) return null;
            
            return (
              <div key={service.id} className="border border-slate-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900">
                      {service.service.title}
                    </h3>
                    {service.service.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {service.service.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        Started {format(new Date(service.createdAt), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs font-medium text-slate-700">
                        ${service.service.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                      title="Edit service"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
                      title="Remove service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {clientServices.length === 0 && (
            <div className="text-center py-6">
              <p className="text-slate-500">No services started yet.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-2 text-sm text-yellow-600 hover:text-yellow-500"
              >
                Start your first service
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingService(null)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-900">
                  Edit Service Status
                </h3>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-500"
                  onClick={() => setEditingService(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service
                    </label>
                    <p className="text-sm text-slate-900 font-medium">
                      {editingService.service.title}
                    </p>
                    {editingService.service.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {editingService.service.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ClientService['status'])}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      {getStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Service Price:</span>
                      <span className="font-medium text-slate-900">
                        ${editingService.service.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-600">Started:</span>
                      <span className="text-slate-900">
                        {format(new Date(editingService.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {editingService.completedAt && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-600">Completed:</span>
                        <span className="text-slate-900">
                          {format(new Date(editingService.completedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientServicesSection;