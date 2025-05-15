import React, { useState, useEffect } from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useFactsStore } from '../../../stores/factsStore';
import { useAuthStore } from '../../../stores/authStore';
import { useProcessesStore } from '../../../stores/processesStore';

interface ClientFactsSectionProps {
  clientId: string;
}

const ClientFactsSection: React.FC<ClientFactsSectionProps> = ({ clientId }) => {
  const { user } = useAuthStore();
  const { facts, fetchClientFacts, addFact, linkFactToProcess } = useFactsStore();
  const { processes } = useProcessesStore();
  const [newFact, setNewFact] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchClientFacts(clientId);
  }, [clientId, fetchClientFacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newFact.trim()) return;

    await addFact({
      clientId,
      reportedBy: user.id,
      content: newFact.trim(),
      processId: selectedProcess || undefined
    });

    setNewFact('');
    setSelectedProcess('');
    setIsAdding(false);
  };

  const clientProcesses = processes.filter(p => p.clientId === clientId);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-slate-900">Client Facts</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Fact
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fact" className="block text-sm font-medium text-slate-700">
                  Reported Facts *
                </label>
                <textarea
                  id="fact"
                  rows={4}
                  required
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter the reported facts..."
                />
              </div>

              <div>
                <label htmlFor="process" className="block text-sm font-medium text-slate-700">
                  Link to Process (Optional)
                </label>
                <select
                  id="process"
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                >
                  <option value="">Select a process</option>
                  {clientProcesses.map(process => (
                    <option key={process.id} value={process.id}>
                      {process.title}
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
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Save Fact
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {facts.map(fact => (
            <div key={fact.id} className="border border-slate-200 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">
                    {fact.content}
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    Reported {format(new Date(fact.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                {!fact.processId && clientProcesses.length > 0 && (
                  <div className="ml-4">
                    <select
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                      onChange={(e) => linkFactToProcess(fact.id, e.target.value)}
                    >
                      <option value="">Link to process</option>
                      {clientProcesses.map(process => (
                        <option key={process.id} value={process.id}>
                          {process.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {fact.processId && (
                <div className="mt-2 flex items-center text-xs text-slate-600">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  Linked to: {clientProcesses.find(p => p.id === fact.processId)?.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientFactsSection;