import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProcessesStore } from '../../stores/processesStore';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import DocumentsSection from './components/DocumentsSection';

const ProcessDetailsPage = () => {
  const { id } = useParams();
  const { selectedProcess, getProcess, isLoading } = useProcessesStore();

  useEffect(() => {
    if (id) {
      getProcess(id);
    }
  }, [id, getProcess]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProcess) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-slate-600">Process not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'waiting_client': return 'bg-purple-100 text-purple-800';
      case 'waiting_court': return 'bg-indigo-100 text-indigo-800';
      case 'waiting_document': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <Link 
          to="/processes"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Processes
        </Link>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          {selectedProcess.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Process Details and Documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Process Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Process Information</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProcess.status)}`}>
                    {selectedProcess.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Priority</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedProcess.priority)}`}>
                    {selectedProcess.priority}
                  </span>
                </div>
              </div>
              {selectedProcess.court && (
                <div>
                  <span className="text-sm text-slate-500">Court</span>
                  <p className="mt-1 text-sm text-slate-900">{selectedProcess.court}</p>
                </div>
              )}
              {selectedProcess.caseNumber && (
                <div>
                  <span className="text-sm text-slate-500">Case Number</span>
                  <p className="mt-1 text-sm text-slate-900">{selectedProcess.caseNumber}</p>
                </div>
              )}
              {selectedProcess.dueDate && (
                <div>
                  <span className="text-sm text-slate-500">Due Date</span>
                  <p className="mt-1 text-sm text-slate-900">
                    {format(new Date(selectedProcess.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-slate-500">Created</span>
                <p className="mt-1 text-sm text-slate-900">
                  {format(new Date(selectedProcess.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents and Activities */}
        <div className="lg:col-span-2 space-y-6">
          <DocumentsSection processId={selectedProcess.id} />
          
          {/* Activities section will be added here */}
        </div>
      </div>
    </div>
  );
};

export default ProcessDetailsPage;