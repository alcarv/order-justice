import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon, User } from 'lucide-react';
import { useCalendarStore } from '../../../stores/calendarStore';
import { useClientsStore } from '../../../stores/clientsStore';
import { useProcessesStore } from '../../../stores/processesStore';
import { useContractsStore } from '../../../stores/contractsStore';
import { useAuthStore } from '../../../stores/authStore';
import { CalendarEvent, CalendarEventType, CalendarEventPriority } from '../../../types';
import { useUsersStore } from '../../../stores/usersStore';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  selectedDate?: Date | null;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedDate
}) => {
  const { addEvent, updateEvent, isLoading } = useCalendarStore();
const { companyUsers } = useUsersStore();
  const { clients } = useClientsStore();
  const { processes } = useProcessesStore();
  const { contracts } = useContractsStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'reminder' as CalendarEventType,
    priority: 'medium' as CalendarEventPriority,
    startTime: '',
    endTime: '',
    allDay: false,
    location: '',
    clientId: '',
    processId: '',
    contractId: '',
    attendees: [] as string[],
    color: '#3B82F6',
    assignedTo: '' // New field for assigning to other users
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        type: event.type,
        priority: event.priority,
        startTime: new Date(event.startTime).toISOString().slice(0, 16),
        endTime: new Date(event.endTime).toISOString().slice(0, 16),
        allDay: event.allDay,
        location: event.location || '',
        clientId: event.clientId || '',
        processId: event.processId || '',
        contractId: event.contractId || '',
        attendees: event.attendees || [],
        color: event.color || '#3B82F6',
        assignedTo: event.createdBy?.id || ''
      });
    } else if (selectedDate) {
      const startTime = new Date(selectedDate);
      startTime.setHours(9, 0, 0, 0);
      const endTime = new Date(selectedDate);
      endTime.setHours(10, 0, 0, 0);

      setFormData(prev => ({
        ...prev,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        assignedTo: user?.id || ''
      }));
    }
  }, [event, selectedDate, isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const eventData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        createdBy: formData.assignedTo || user.id, // Use assigned user or current user
        isCompleted: false,
        clientId: formData.clientId || undefined,
        processId: formData.processId || undefined,
        contractId: formData.contractId || undefined,
      };

      // Remove assignedTo from the data sent to backend
      const { assignedTo, ...backendData } = eventData;

      if (event?.id) {
        await updateEvent(event.id, backendData);
      } else {
        await addEvent(backendData);
      }

      onClose();
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const eventTypeOptions = [
    { value: 'deadline', label: 'Deadline', color: '#EF4444' },
    { value: 'meeting', label: 'Meeting', color: '#3B82F6' },
    { value: 'court_hearing', label: 'Court Hearing', color: '#8B5CF6' },
    { value: 'reminder', label: 'Reminder', color: '#F59E0B' },
    { value: 'appointment', label: 'Appointment', color: '#10B981' },
    { value: 'other', label: 'Other', color: '#6B7280' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#3B82F6' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#F97316' },
    { value: 'urgent', label: 'Urgent', color: '#EF4444' }
  ];

  const getAssignedUserName = () => {
    if (!formData.assignedTo) return 'Current User';
    const assignedUser = companyUsers.find(u => u.id === formData.assignedTo);
    return assignedUser ? assignedUser.name : 'Unknown User';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {event ? 'Edit Event' : 'New Calendar Event'}
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Assignment Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="text-sm font-medium text-blue-900">Event Assignment</h4>
                  </div>
                  
                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">
                      Assign to User *
                    </label>
                    <select
                      id="assignedTo"
                      name="assignedTo"
                      required
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      <option value="">Select user</option>
                      {companyUsers.map(companyUser => (
                        <option key={companyUser.id} value={companyUser.id}>
                          {companyUser.name} {companyUser.id === user?.id ? '(You)' : ''}
                        </option>
                      ))}
                    </select>
                    {formData.assignedTo && formData.assignedTo !== user?.id && (
                      <p className="mt-1 text-xs text-blue-600">
                        This event will be created for {getAssignedUserName()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700">
                      Event Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      {eventTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      required
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Event description..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="allDay"
                    name="allDay"
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-slate-300 rounded"
                  />
                  <label htmlFor="allDay" className="ml-2 block text-sm text-slate-700">
                    All day event
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-slate-700">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder="Event location"
                    />
                  </div>
                </div>

                {/* Linking Section */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link to Records
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="clientId" className="block text-sm font-medium text-slate-700">
                        Client
                      </label>
                      <select
                        id="clientId"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      >
                        <option value="">No client linked</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="processId" className="block text-sm font-medium text-slate-700">
                        Process
                      </label>
                      <select
                        id="processId"
                        name="processId"
                        value={formData.processId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      >
                        <option value="">No process linked</option>
                        {processes
                          .filter(process => !formData.clientId || process.clientId === formData.clientId)
                          .map(process => (
                            <option key={process.id} value={process.id}>
                              {process.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contractId" className="block text-sm font-medium text-slate-700">
                        Contract
                      </label>
                      <select
                        id="contractId"
                        name="contractId"
                        value={formData.contractId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      >
                        <option value="">No contract linked</option>
                        {contracts
                          .filter(contract => !formData.clientId || contract.clientId === formData.clientId)
                          .map(contract => (
                            <option key={contract.id} value={contract.id}>
                              {contract.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-slate-700">
                    Event Color
                  </label>
                  <div className="mt-1 flex items-center space-x-3">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="h-10 w-20 border border-slate-300 rounded-md"
                    />
                    <span className="text-sm text-slate-500">Choose a color for this event</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
              >
                {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventModal;