import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useServicesStore } from '../../stores/servicesStore';
import { DocumentType } from '../../types';

const ParametersSection = () => {
  const [activeSection, setActiveSection] = useState('services');
  const { services, addService, isLoading } = useServicesStore();

  const documentTypes: { type: DocumentType; label: string }[] = [
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
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </button>
              </div>

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
                      <tr key={service.id}>
                        <td className="py-4 pl-4 pr-3 text-sm text-slate-900">{service.title}</td>
                        <td className="px-3 py-4 text-sm text-slate-500">{service.description}</td>
                        <td className="px-3 py-4 text-sm text-slate-900 text-right">
                          ${service.price.toFixed(2)}
                        </td>
                        <td className="py-4 pl-3 pr-4 text-right text-sm">
                          <button className="text-slate-400 hover:text-slate-500 mr-2">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Document Types Section */}
          {activeSection === 'documents' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-900">Document Types</h3>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document Type
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documentTypes.map((docType) => (
                  <div
                    key={docType.type}
                    className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-900">{docType.label}</h4>
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-400 hover:text-slate-500">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Parameters Section */}
          {activeSection === 'other' && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Other System Parameters</h3>
              <p className="text-slate-600">Additional system parameters will be added here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParametersSection;