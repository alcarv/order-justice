export type UserRole = 'admin' | 'lawyer' | 'assistant' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
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
  processes: string[];
  contracts: string[];
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

export type DocumentType = 
  | 'CPF'
  | 'RG'
  | 'CNH'
  | 'Certidao_Nascimento'
  | 'Certidao_Casamento'
  | 'Comprovante_Residencia'
  | 'Procuracao'
  | 'Contrato'
  | 'Peticao'
  | 'Decisao'
  | 'Outros';

export interface DocumentTypeItem {
  id: string;
  type: DocumentType;
  label: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  processId: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  documentType: DocumentType;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Process {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: ProcessStatus;
  priority: ProcessPriority;
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  court?: string;
  caseNumber?: string;
  documents: Document[];
  activities: Activity[];
}

export interface Activity {
  id: string;
  processId: string;
  type: 'note' | 'status_change' | 'document_added' | 'assignment_change';
  description: string;
  createdBy: string;
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
  service: Service;
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

// Contract Types
export type ContractStatus = 
  | 'draft'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type ContractType = 
  | 'service'
  | 'retainer'
  | 'contingency'
  | 'hourly'
  | 'fixed';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export type ContractDocumentType = 
  | 'contract'
  | 'amendment'
  | 'invoice'
  | 'receipt'
  | 'other';

export interface Contract {
  id: string;
  title: string;
  description?: string;
  contractNumber: string;
  clientId: string;
  processId?: string;
  status: ContractStatus;
  contractType: ContractType;
  totalValue: number;
  currency: string;
  startDate: string;
  endDate?: string;
  createdBy: string;
  signedAt?: string;
  termsAndConditions?: string;
  notes?: string;
  metadata?: Record<string, any>;
  values: ContractValue[];
  history: ContractHistory[];
  documents: ContractDocument[];
  createdAt: string;
  updatedAt: string;
  client?: Client;
  process?: Process;
}

export interface ContractValue {
  id: string;
  contractId: string;
  description: string;
  amount: number;
  dueDate?: string;
  paidAt?: string;
  paymentMethod?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContractHistory {
  id: string;
  contractId: string;
  action: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  createdBy: string;
  createdAt: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: ContractDocumentType;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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
  processId?: string;
  clientId?: string;
  createdBy: string;
}