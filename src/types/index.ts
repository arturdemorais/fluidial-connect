// CRM System Types

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  value: number;
  currency: 'BRL' | 'USD' | 'EUR';
  stage: PipelineStage;
  source: LeadSource;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
  tags: string[];
  customFields: CustomFieldValue[];
  contacts: Contact[];
  conversations: Conversation[];
  activities: Activity[];
}

export interface Contact {
  id: string;
  type: ContactChannel;
  value: string;
  verified: boolean;
  primary: boolean;
}

export type ContactChannel = 'whatsapp' | 'instagram' | 'phone' | 'email';

export interface Conversation {
  id: string;
  leadId: string;
  channel: ContactChannel;
  messages: Message[];
  status: 'active' | 'archived' | 'pending';
  lastMessage?: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'lead';
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'document';
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'created'
  | 'stage_changed'
  | 'message_sent'
  | 'message_received'
  | 'call_made'
  | 'note_added'
  | 'field_updated';

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  isClosedWon?: boolean;
  isClosedLost?: boolean;
}

export type LeadSource = 
  | 'whatsapp'
  | 'instagram'
  | 'website'
  | 'referral'
  | 'phone'
  | 'email'
  | 'social';

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
  required: boolean;
  options?: string[]; // For select type
  order: number;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number | boolean | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'sales';
}

export interface Integration {
  id: string;
  name: string;
  type: ContactChannel;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  config: Record<string, any>;
}

export interface Account {
  id: string;
  name: string;
  domain: string;
  pipeline: PipelineStage[];
  customFields: CustomField[];
  integrations: Integration[];
  settings: AccountSettings;
}

export interface AccountSettings {
  currency: 'BRL' | 'USD' | 'EUR';
  timezone: string;
  language: 'pt' | 'en' | 'es';
  dateFormat: string;
}