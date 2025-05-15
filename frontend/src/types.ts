export type UserRole = 'admin' | 'lawyer' | 'assistant' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  avatar?: string;
  processes: string[]; // Array of process IDs
}

export type ProcessStatus = 
  | 'pending'
  | 'in_progress'
  | 'waiting_client'
  | 'waiting_court'
  | 'waiting_document'
  | 'closed'
  | 'archived';

export type ProcessPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Process {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: ProcessStatus;
  priority: ProcessPriority;
  assignedTo: string[];  // Array of user IDs
  createdBy: string;     // User ID
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  court?: string;
  caseNumber?: string;
  documents: Document[];
  activities: Activity[];
}

export interface Document {
  id: string;
  name: string;
  processId: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;  // User ID
  uploadedAt: string;
  description?: string;
}

export interface Activity {
  id: string;
  processId: string;
  type: 'note' | 'status_change' | 'document_added' | 'assignment_change';
  description: string;
  createdBy: string;  // User ID
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type ClientServiceStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ClientService {
  id: string;
  clientId: string;
  serviceId: string;
  status: ClientServiceStatus;
  assignedTo: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFact {
  id: string;
  clientId: string;
  reportedBy: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  processId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  processId?: string;  // Optional link to a process
  clientId?: string;   // Optional link to a client
  createdBy: string;   // User ID
}