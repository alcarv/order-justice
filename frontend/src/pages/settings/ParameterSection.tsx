import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useServicesStore } from '../../stores/servicesStore';
import { useDocumentTypesStore } from '../../stores/documentTypesStore';
import { DocumentType } from '../../types';

const ParametersSection = () => {
  const [activeSection, setActiveSection] = useState('services');
  
  // Services state
  const { services, addService, updateService, deleteService, fetchServices, isLoading: servicesLoading } = useServicesStore();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: 0
  });

  // Document types state
  const { documentTypes, addDocumentType, updateDocumentType, deleteDocumentType, fetchDocumentTypes, isLoading: docTypesLoading } = useDocumentTypesStore();
  const [isDocTypeModalOpen, setIsDocTypeModalOpen] = useState(false);
  const [editingDocType, setEditingDocType] = useState<any>(null);
  const [docTypeForm, setDocTypeForm] = useState({
    type: '' as DocumentType,
    label: '',
    description: '',
    isActive: true
  });

  const predefinedDocTypes: { type: DocumentType; label: string }[] = [
    { type: 'CPF', label: 'CPF' },
    { type: 'RG', label: 'RG' },
    { type: 'CNH', label: 'CNH' },
    { type: 'Certidao_Nascimento', label: 'Certidão de Nascimento' },
    { type: 'Certidao_Casamento', label: 'Certidão de Casamento' },
    { type: 'Comprovante_Residencia', label: 'Comprovante de Residência' },
    { type: 'Procuracao', label: 'Procuração' },
    { type: 'Contrato', label: 'Contrato' },
    { type: 'Peticao', label: 'Petição' },
    { type: 'Decisao', label: 'Decisão' },
    { type: 'Outros', label: 'Outros' },
  ];

  useEffect(() => {
    fetchServices();
    fetchDocumentTypes();
  }, [fetchServices, fetchDocumentTypes]);

  // Service handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
      } else {
        await addService(serviceForm);
      }
      
      setServiceForm({ title: '', description: '', price: 0 });
      setEditingService(null);
      setIsServiceModalOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description || '',
      price: service.price
    });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceForm({ title: '', description: '', price: 0 });
    setIsServiceModalOpen(true);
  };

  // Document type handlers
  const handleDocTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDocType) {
        await updateDocumentType(editingDocType.id, docTypeForm);
      } else {
        await addDocumentType(docTypeForm);
      }
      
      setDocTypeForm({ type: '' as DocumentType, label: '', description: '', isActive: true });
      setEditingDocType(null);
      setIsDocTypeModalOpen(false);
    } catch (error) {
      console.error('Error saving document type:', error);
    }
  };

  const handleEditDocType = (docType: any) => {
    setEditingDocType(docType);
    setDocTypeForm({
      type: docType.type,
      label: docType.label,
      description: docType.description || '',
      isActive: docType.isActive
    });
    setIsDocTypeModalOpen(true);
  };

  const handleDeleteDocType = async (docTypeId: string) => {
    if (window.confirm('Are you sure you want to delete this document type?')) {
      try {
        await deleteDocumentType(docTypeId);
      } catch (error) {
        console.error('Error deleting document type:', error);
      }
    }
  };

  const openAddDocTypeModal = () => {
    setEditingDocType(null);
    setDocTypeForm({ type: '' as DocumentType, label: '', description: '', isActive: true });
    setIsDocTypeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="sm:hidden">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="block w-full rounded-md border-slate-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="services">Services</option>
              <option value="documents">Document Types</option>
              <option value="other">Other Parameters</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveSection('services')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeSection === 'services'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveSection('documents')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeSection === 'documents'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  Document Types
                </button>
                <button
                  onClick={() => setActiveSection('other')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeSection === 'other'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  Other Parameters
                </button>
              </nav>
            </div>
          </div>

          {/* Services Section */}
          {activeSection === 'services' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-900">Legal Services</h3>
                <button
                  onClick={openAddServiceModal}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </button>
              </div>

              {servicesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
                  <p className="mt-2 text-sm text-slate-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No services configured yet.</p>
                  <button
                    onClick={openAddServiceModal}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">Service</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Description</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900">Price</th>
                        <th className="relative py-3.5 pl-3 pr-4">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-50">
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-slate-900">{service.title}</td>
                          <td className="px-3 py-4 text-sm text-slate-500">{service.description || '-'}</td>
                          <td className="px-3 py-4 text-sm text-slate-900 text-right font-medium">
                            ${service.price}
                          </td>
                          <td className="py-4 pl-3 pr-4 text-right text-sm">
                            <button 
                              onClick={() => handleEditService(service)}
                              className="text-slate-400 hover:text-slate-600 mr-3 p-1 rounded-full hover:bg-slate-100"
                              title="Edit service"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteService(service.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                              title="Delete service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Document Types Section */}
          {activeSection === 'documents' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-900">Document Types</h3>
                <button
                  onClick={openAddDocTypeModal}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document Type
                </button>
              </div>

              {docTypesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
                  <p className="mt-2 text-sm text-slate-600">Loading document types...</p>
                </div>
              ) : documentTypes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No document types configured yet.</p>
                  <button
                    onClick={openAddDocTypeModal}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Document Type
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {documentTypes.map((docType) => (
                    <div
                      key={docType.id}
                      className={`relative rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${
                        docType.isActive ? 'border-slate-200 bg-white' : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-slate-900">{docType.label}</h4>
                            {!docType.isActive && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                Inactive
                              </span>
                            )}
                          </div>
                          {docType.description && (
                            <p className="mt-1 text-xs text-slate-500">{docType.description}</p>
                          )}
                          <p className="mt-1 text-xs text-slate-400 font-mono">{docType.type}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button 
                            onClick={() => handleEditDocType(docType)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                            title="Edit document type"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDocType(docType.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                            title="Delete document type"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other Parameters Section */}
          {activeSection === 'other' && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Other System Parameters</h3>
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-600">Additional system parameters will be added here.</p>
                <p className="text-sm text-slate-500 mt-2">
                  This section will include court configurations, process status customization, and other system settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsServiceModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-500"
                  onClick={() => setIsServiceModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleServiceSubmit}>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        placeholder="e.g., Legal Consultation"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        placeholder="Brief description of the service"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    onClick={() => setIsServiceModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={servicesLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
                  >
                    {servicesLoading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Type Modal */}
      {isDocTypeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDocTypeModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-medium text-slate-900">
                  {editingDocType ? 'Edit Document Type' : 'Add New Document Type'}
                </h3>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-500"
                  onClick={() => setIsDocTypeModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleDocTypeSubmit}>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="docType" className="block text-sm font-medium text-slate-700">
                        Document Type *
                      </label>
                      <select
                        id="docType"
                        required
                        value={docTypeForm.type}
                        onChange={(e) => {
                          const selectedType = e.target.value as DocumentType;
                          const predefined = predefinedDocTypes.find(p => p.type === selectedType);
                          setDocTypeForm(prev => ({ 
                            ...prev, 
                            type: selectedType,
                            label: predefined?.label || prev.label
                          }));
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      >
                        <option value="">Select document type</option>
                        {predefinedDocTypes.map(type => (
                          <option key={type.type} value={type.type}>
                            {type.label} ({type.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="label" className="block text-sm font-medium text-slate-700">
                        Display Label *
                      </label>
                      <input
                        type="text"
                        id="label"
                        required
                        value={docTypeForm.label}
                        onChange={(e) => setDocTypeForm(prev => ({ ...prev, label: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        placeholder="e.g., Certidão de Nascimento"
                      />
                    </div>

                    <div>
                      <label htmlFor="docDescription" className="block text-sm font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        id="docDescription"
                        rows={3}
                        value={docTypeForm.description}
                        onChange={(e) => setDocTypeForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        placeholder="Optional description for this document type"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="isActive"
                        type="checkbox"
                        checked={docTypeForm.isActive}
                        onChange={(e) => setDocTypeForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-slate-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700">
                        Active (available for use)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    onClick={() => setIsDocTypeModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={docTypesLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
                  >
                    {docTypesLoading ? 'Saving...' : editingDocType ? 'Update Document Type' : 'Add Document Type'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParametersSection;