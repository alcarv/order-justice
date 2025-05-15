import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Client } from '../../../types';
import { useProcessesStore } from '../../../stores/processesStore';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const { processes } = useProcessesStore();
  
  // Get active processes count
  const activeProcesses = processes.filter(p => 
    client.processes.includes(p.id) && 
    p.status !== 'closed' && 
    p.status !== 'archived'
  ).length;
  
  return (
    <Link
      to={`/clients/${client.id}`}
      className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {client.avatar ? (
              <img 
                src={client.avatar} 
                alt={client.name} 
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-lg">
                {client.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-slate-900 line-clamp-1">
                {client.name}
              </h3>
              <div className="flex items-center mt-1">
                <FileText className="h-4 w-4 text-slate-400 mr-1" />
                <span className="text-sm text-slate-500">
                  {client.processes.length} {client.processes.length === 1 ? 'process' : 'processes'}
                  {activeProcesses > 0 && ` (${activeProcesses} active)`}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start">
            <Mail className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-slate-600 line-clamp-1">{client.email}</span>
          </div>
          <div className="flex items-start">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-slate-600">{client.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-slate-600 line-clamp-2">{client.address}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-slate-50 text-right">
        <span className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
          View details →
        </span>
      </div>
    </Link>
  );
};

export default ClientCard;