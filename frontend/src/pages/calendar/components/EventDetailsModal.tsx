import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon, Edit2, Trash2, CheckCircle, AlertCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarStore } from '../../../stores/calendarStore';
import { CalendarEvent, CalendarEventType, CalendarEventPriority } from '../../../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit: (event: CalendarEvent) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit
}) => {
  const { deleteEvent, completeEvent, isLoading } = useCalendarStore();

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(event.id);
        onClose();
      } catch (error) {
        // Error is handled in the store
      }
    }
  };

  const handleComplete = async () => {
    try {
      await completeEvent(event.id);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const getEventTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'deadline': return 'bg-red-500';
      case 'meeting': return 'bg-blue-500';
      case 'court_hearing': return 'bg-purple-500';
      case 'reminder': return 'bg-yellow-500';
      case 'appointment': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: CalendarEventPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventType = (type: CalendarEventType) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${getEventTypeColor(event.type)}`}></div>
              Event Details
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-xl font-semibold text-slate-900">{event.title}</h4>
                  {event.isCompleted && (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </span>
                  <span className="text-sm text-slate-600">
                    {formatEventType(event.type)}
                  </span>
                </div>
              </div>

              {/* Created By Information */}
              {event.createdBy && (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-slate-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Created by</p>
                      <p className="text-sm text-slate-600">
                        {event.createdBy.name} ({event.createdBy.email})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div>
                  <p className="text-sm text-slate-700">{event.description}</p>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                <div>
                  {event.allDay ? (
                    <span>All day - {format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}</span>
                  ) : (
                    <div>
                      <div>{format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}</div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{event.location}</span>
                </div>
              )}

              {/* Attendees */}
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{event.attendees.length} attendees</span>
                </div>
              )}

              {/* Linked Records */}
              {(event.client || event.process || event.contract) && (
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Linked Records
                  </h5>
                  <div className="space-y-2">
                    {event.client && (
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          Client
                        </span>
                        <span className="text-slate-700">{event.client.name}</span>
                      </div>
                    )}
                    {event.process && (
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                          Process
                        </span>
                        <span className="text-slate-700">{event.process.title}</span>
                      </div>
                    )}
                    {event.contract && (
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                          Contract
                        </span>
                        <span className="text-slate-700">{event.contract.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Status */}
              {event.isCompleted && event.completedAt && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Event Completed</p>
                      <p className="text-xs text-green-600">
                        Completed on {format(new Date(event.completedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Overdue Warning */}
              {!event.isCompleted && new Date(event.endTime) < new Date() && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Event Overdue</p>
                      <p className="text-xs text-red-600">
                        This event was scheduled to end on {format(new Date(event.endTime), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Created Info */}
              <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
                Created on {format(new Date(event.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 flex justify-between">
            <div className="flex space-x-2">
              {!event.isCompleted && (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;