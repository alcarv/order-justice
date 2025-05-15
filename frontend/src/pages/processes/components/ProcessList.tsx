import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Process } from '../../../types';
import { Clock, AlertCircle } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
}

const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {processes.map((process) => (
          <li key={process.id}>
            <Link
              to={`/processes/${process.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {process.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                        {process.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(process.priority)}`}>
                        {process.priority}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      {process.caseNumber && (
                        <span className="truncate">
                          Case #{process.caseNumber}
                        </span>
                      )}
                      {process.court && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="truncate">{process.court}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {process.dueDate && (
                    <div className="ml-4 flex-shrink-0 flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>Due {format(new Date(process.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessList;