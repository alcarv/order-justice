import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Filter, Search, Clock, MapPin, Users, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { useCalendarStore } from '../../stores/calendarStore';
import { useClientsStore } from '../../stores/clientsStore';
import { useProcessesStore } from '../../stores/processesStore';
import { useContractsStore } from '../../stores/contractsStore';
import { useAuthStore } from '../../stores/authStore';
import { useUsersStore } from '../../stores/usersStore';
import CalendarEventModal from './components/CalendarEventModal';
import EventDetailsModal from './components/EventDetailsModal';
import { CalendarEvent, CalendarEventType, CalendarEventPriority } from '../../types';

const CalendarPage = () => {
  const { user } = useAuthStore();
  const { 
    events, 
    currentDate, 
    viewMode, 
    selectedUserId,
    myEventsOnly,
    isLoading, 
    fetchEvents, 
    setCurrentDate, 
    setViewMode,
    setSelectedUserId,
    setMyEventsOnly,
    getEventsForDate 
  } = useCalendarStore();

  const { companyUsers, fetchCompanyUsers } = useUsersStore();
  
  const { clients, fetchClients } = useClientsStore();
  const { processes, fetchProcesses } = useProcessesStore();
  const { contracts, fetchContracts } = useContractsStore();
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    clientId: '',
    processId: '',
    contractId: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchClients();
    fetchProcesses();
    fetchContracts();
    fetchCompanyUsers();
  }, [fetchEvents, fetchClients, fetchProcesses, fetchContracts, fetchCompanyUsers]);

  const handlePrevious = () => {
    const newDate = viewMode === 'month' 
      ? subMonths(currentDate, 1)
      : new Date(currentDate.getTime() - (viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = viewMode === 'month' 
      ? addMonths(currentDate, 1)
      : new Date(currentDate.getTime() + (viewMode === 'week' ? 7 : 1) * 24 * 60 * 60 * 1000);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    if (viewMode === 'month') {
      setViewMode('day');
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const openNewEventModal = (date?: Date) => {
    setSelectedDate(date || currentDate);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchEvents({ ...newFilters, search: searchTerm });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    fetchEvents({ ...filters, search: value });
  };

  const clearFilters = () => {
    setFilters({ type: '', priority: '', clientId: '', processId: '', contractId: '' });
    setSearchTerm('');
    setSelectedUserId(null);
    setMyEventsOnly(false);
    fetchEvents();
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
      case 'urgent': return 'border-l-4 border-red-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || event.type === filters.type;
    const matchesPriority = !filters.priority || event.priority === filters.priority;
    const matchesClient = !filters.clientId || event.clientId === filters.clientId;
    const matchesProcess = !filters.processId || event.processId === filters.processId;
    const matchesContract = !filters.contractId || event.contractId === filters.contractId;

    return matchesSearch && matchesType && matchesPriority && matchesClient && matchesProcess && matchesContract;
  });

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-0 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {days.map(day => {
            const dayEvents = getEventsForDate(day).filter(event => 
              filteredEvents.some(fe => fe.id === event.id)
            );
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border-b border-r border-slate-200 cursor-pointer hover:bg-slate-50 ${
                  !isCurrentMonth ? 'bg-slate-50 text-slate-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)} ${
                        event.isCompleted ? 'opacity-50 line-through' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{event.title}</span>
                        {event.createdBy && (
                          <span className="ml-1 text-xs opacity-75">
                            {event.createdBy.name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const upcomingEvents = filteredEvents
      .filter(event => new Date(event.startTime) >= new Date() && !event.isCompleted)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 20);

    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(event.priority)}`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                        <h4 className="font-medium text-slate-900">{event.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {event.priority}
                        </span>
                        {event.createdBy && (
                          <div className="flex items-center text-xs text-slate-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{event.createdBy.name}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(event.startTime), 'MMM d, yyyy h:mm a')}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                      {(event.client || event.process || event.contract) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {event.client && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Client: {event.client.name}
                            </span>
                          )}
                          {event.process && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Process: {event.process.title}
                            </span>
                          )}
                          {event.contract && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Contract: {event.contract.title}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Calendar</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage deadlines, meetings, and important dates
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => openNewEventModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              >
                Today
              </button>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            {['month', 'agenda'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  viewMode === mode
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* User Filtering */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">View:</label>
            <button
              onClick={() => setMyEventsOnly(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                myEventsOnly
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => setMyEventsOnly(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                !myEventsOnly && !selectedUserId
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Events
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">Filter by user:</label>
            <select
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(e.target.value || null)}
              className="px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
            >
              <option value="">All Users</option>
              {companyUsers.map(users => (
                <option key={users.id} value={users.id}>
                  {users.name} {users.id === user?.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="deadline">Deadline</option>
            <option value="meeting">Meeting</option>
            <option value="court_hearing">Court Hearing</option>
            <option value="reminder">Reminder</option>
            <option value="appointment">Appointment</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.clientId}
            onChange={(e) => handleFilterChange('clientId', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <select
            value={filters.processId}
            onChange={(e) => handleFilterChange('processId', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Processes</option>
            {processes.map(process => (
              <option key={process.id} value={process.id}>
                {process.title}
              </option>
            ))}
          </select>

          <select
            value={filters.contractId}
            onChange={(e) => handleFilterChange('contractId', e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          >
            <option value="">All Contracts</option>
            {contracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.title}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || Object.values(filters).some(v => v) || selectedUserId || myEventsOnly) && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Calendar View */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-600">Loading calendar...</p>
        </div>
      ) : viewMode === 'month' ? (
        renderMonthView()
      ) : (
        renderAgendaView()
      )}

      {/* Modals */}
      <CalendarEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        selectedDate={selectedDate}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
        onEdit={(event) => {
          setSelectedEvent(event);
          setIsDetailsModalOpen(false);
          setIsEventModalOpen(true);
        }}
      />
    </div>
  );
};

export default CalendarPage;