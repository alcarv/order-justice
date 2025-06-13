import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, DollarSign, FileText, Clock, User, Calendar, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useContractsStore } from '../../stores/contractsStore';
import { useAuthStore } from '../../stores/authStore';
import ContractValueModal from './components/ContractValueModal';
import ContractDocumentModal from './components/ContractDocumentModal';
import ContractFormModal from './components/ContractFormModal';

const ContractDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { 
    selectedContract, 
    getContract, 
    deleteContractValue, 
    deleteContractDocument, 
    isLoading 
  } = useContractsStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getContract(id);
    }
  }, [id, getContract]);

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

  if (!selectedContract) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-slate-600">Contract not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = selectedContract.values?.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.amount, 0) || 0;
  const totalPending = selectedContract.values?.filter(v => v.status === 'pending').reduce((sum, v) => sum + v.amount, 0) || 0;
  const totalOverdue = selectedContract.values?.filter(v => v.status === 'overdue').reduce((sum, v) => sum + v.amount, 0) || 0;
  const paymentProgress = (totalPaid / selectedContract.totalValue) * 100;

  const handleDeleteValue = async (valueId: string) => {
    if (window.confirm('Are you sure you want to delete this payment entry?')) {
      await deleteContractValue(valueId);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteContractDocument(documentId);
    }
  };

  const handleEditValue = (value: any) => {
    setEditingValue(value);
    setIsValueModalOpen(true);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'history', name: 'History', icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <Link 
          to="/contracts"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Contracts
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              {selectedContract.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {selectedContract.contractNumber}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContract.status)}`}>
              {selectedContract.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedContract.contractType)}`}>
              {selectedContract.contractType}
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Contract
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Total Value</p>
              <p className="text-lg font-semibold text-slate-900">
                ${selectedContract.totalValue.toLocaleString()} {selectedContract.currency}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Paid</p>
              <p className="text-lg font-semibold text-slate-900">
                ${totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-lg font-semibold text-slate-900">
                ${totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Overdue</p>
              <p className="text-lg font-semibold text-slate-900">
                ${totalOverdue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Payment Progress</span>
          <span>{paymentProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(paymentProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 text-sm font-medium
                    ${activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Contract Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-500">Client</label>
                      <p className="text-sm text-slate-900 font-medium">
                        {selectedContract.client?.name || 'Unknown Client'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Start Date</label>
                      <p className="text-sm text-slate-900">
                        {format(new Date(selectedContract.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {selectedContract.endDate && (
                      <div>
                        <label className="text-sm text-slate-500">End Date</label>
                        <p className="text-sm text-slate-900">
                          {format(new Date(selectedContract.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-slate-500">Created</label>
                      <p className="text-sm text-slate-900">
                        {format(new Date(selectedContract.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Details</h3>
                  {selectedContract.description && (
                    <div className="mb-4">
                      <label className="text-sm text-slate-500">Description</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedContract.description}</p>
                    </div>
                  )}
                  {selectedContract.termsAndConditions && (
                    <div className="mb-4">
                      <label className="text-sm text-slate-500">Terms & Conditions</label>
                      <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                        {selectedContract.termsAndConditions}
                      </p>
                    </div>
                  )}
                  {selectedContract.notes && (
                    <div>
                      <label className="text-sm text-slate-500">Notes</label>
                      <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                        {selectedContract.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-900">Payment Entries</h3>
                <button
                  onClick={() => {
                    setEditingValue(null);
                    setIsValueModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </button>
              </div>

              {selectedContract.values && selectedContract.values.length > 0 ? (
                <div className="space-y-4">
                  {selectedContract.values.map((value) => (
                    <div key={value.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm font-medium text-slate-900">
                              {value.description}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(value.status)}`}>
                              {value.status}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-slate-500">
                            <span className="font-medium text-slate-900">
                              ${value.amount.toLocaleString()}
                            </span>
                            {value.dueDate && (
                              <span>Due: {format(new Date(value.dueDate), 'MMM d, yyyy')}</span>
                            )}
                            {value.paidAt && (
                              <span>Paid: {format(new Date(value.paidAt), 'MMM d, yyyy')}</span>
                            )}
                            {value.paymentMethod && (
                              <span>Method: {value.paymentMethod}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditValue(value)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            title="Edit payment"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteValue(value.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
                            title="Delete payment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No payment entries</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Get started by adding your first payment entry.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-900">Contract Documents</h3>
                <button
                  onClick={() => setIsDocumentModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>

              {selectedContract.documents && selectedContract.documents.length > 0 ? (
                <div className="space-y-4">
                  {selectedContract.documents.map((doc) => (
                    <div key={doc.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-slate-100 rounded">
                            <FileText className="h-6 w-6 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">{doc.name}</h4>
                            {doc.description && (
                              <p className="mt-1 text-sm text-slate-500">{doc.description}</p>
                            )}
                            <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                              <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                              <span className="capitalize">{doc.documentType}</span>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {doc.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <a
                            href={doc.fileUrl}
                            download
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
                            title="Delete document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No documents</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Get started by uploading your first document.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-6">Contract History</h3>
              
              {selectedContract.history && selectedContract.history.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {selectedContract.history.map((entry, entryIdx) => (
                      <li key={entry.id}>
                        <div className="relative pb-8">
                          {entryIdx !== selectedContract.history.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-slate-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-slate-900 capitalize">
                                    {entry.action.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-slate-500">
                                  {format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-slate-700">
                                <p>{entry.description}</p>
                                {entry.oldValues && entry.newValues && (
                                  <div className="mt-2 text-xs text-slate-500">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="font-medium">Before:</span>
                                        <pre className="mt-1 whitespace-pre-wrap">
                                          {JSON.stringify(entry.oldValues, null, 2)}
                                        </pre>
                                      </div>
                                      <div>
                                        <span className="font-medium">After:</span>
                                        <pre className="mt-1 whitespace-pre-wrap">
                                          {JSON.stringify(entry.newValues, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No history</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Contract history will appear here as changes are made.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ContractValueModal
        isOpen={isValueModalOpen}
        onClose={() => {
          setIsValueModalOpen(false);
          setEditingValue(null);
        }}
        contractId={selectedContract.id}
        value={editingValue}
      />

      <ContractDocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        contractId={selectedContract.id}
      />

      <ContractFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contract={selectedContract}
      />
    </div>
  );
};

export default ContractDetailsPage;