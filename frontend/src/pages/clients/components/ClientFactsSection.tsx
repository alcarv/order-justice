import React, { useState, useEffect } from 'react';
import { Plus, Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFactsStore } from '../../../stores/factsStore';
import { useAuthStore } from '../../../stores/authStore';
import { useProcessesStore } from '../../../stores/processesStore';

interface ClientFactsSectionProps {
  clientId: string;
}

const ClientFactsSection: React.FC<ClientFactsSectionProps> = ({ clientId }) => {
  const { user } = useAuthStore();
  const { facts, fetchClientFacts, addFact, updateFact, deleteFact, linkFactToProcess } = useFactsStore();
  const { clientProcesses, getProcessListByClientId } = useProcessesStore();
  const [newFact, setNewFact] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingFact, setEditingFact] = useState<{ id: string; content: string } | null>(null);

  useEffect(() => {
    getProcessListByClientId(clientId);
  }, [clientId, getProcessListByClientId]);
  
  useEffect(() => {
    fetchClientFacts(clientId);
  }, [clientId, fetchClientFacts]);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFact) return;

    await updateFact(editingFact.id, editingFact.content);
    setEditingFact(null);
  };


  const handleDelete = async (factId: string) => {
    if (window.confirm('Are you sure you want to delete this fact?')) {
      await deleteFact(factId);
    }
  };

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

  const clientProcessesList = clientProcesses;

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
                  {clientProcessesList.map(process => (
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
                  {editingFact?.id === fact.id ? (
                    <form onSubmit={handleUpdate} className="space-y-3">
                      <textarea
                        value={editingFact.content}
                        onChange={(e) => setEditingFact({ ...editingFact, content: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingFact(null)}
                          className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-sm font-medium text-white bg-slate-800 rounded-md hover:bg-slate-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-sm text-slate-900 whitespace-pre-wrap">
                        {fact.content}
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        Reported {format(new Date(fact.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </>
                  )}
                </div>
                {!editingFact && (
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => setEditingFact({ id: fact.id, content: fact.content })}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                      title="Edit fact"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fact.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
                      title="Delete fact"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                {fact.processId ? (
                  <div className="flex items-center text-xs text-slate-600">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Linked to: {clientProcessesList.find(p => p.id === fact.processId)?.title}
                  </div>
                ) : clientProcessesList.length > 0 ? (
                  <select
                    className="text-xs border border-slate-300 rounded px-2 py-1"
                    onChange={(e) => linkFactToProcess(fact.id, e.target.value)}
                  >
                    <option value="">Link to process</option>
                    {clientProcessesList.map(process => (
                      <option key={process.id} value={process.id}>
                        {process.title}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientFactsSection;