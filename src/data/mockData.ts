import { 
  Lead, 
  PipelineStage, 
  User, 
  Integration, 
  CustomField, 
  Conversation, 
  Message,
  Activity,
  Account
} from '@/types';

// Pipeline Stages
export const defaultPipelineStages: PipelineStage[] = [
  {
    id: 'new',
    name: 'Novo Lead',
    color: 'hsl(197, 92%, 58%)',
    order: 1
  },
  {
    id: 'qualifying',
    name: 'Qualificando',
    color: 'hsl(38, 92%, 58%)',
    order: 2
  },
  {
    id: 'proposal',
    name: 'Proposta',
    color: 'hsl(277, 78%, 58%)',
    order: 3
  },
  {
    id: 'closing',
    name: 'Fechamento',
    color: 'hsl(142, 76%, 45%)',
    order: 4,
    isClosedWon: true
  }
];

// Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@empresa.com',
    avatar: '👨‍💼',
    role: 'manager'
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana@empresa.com',
    avatar: '👩‍💼',
    role: 'sales'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@empresa.com',
    avatar: '👨‍💻',
    role: 'sales'
  }
];

// Custom Fields
export const mockCustomFields: CustomField[] = [
  {
    id: 'budget',
    name: 'Orçamento',
    type: 'number',
    required: false,
    order: 1
  },
  {
    id: 'timeline',
    name: 'Prazo de Decisão',
    type: 'date',
    required: false,
    order: 2
  },
  {
    id: 'decision_maker',
    name: 'Decisor',
    type: 'select',
    required: false,
    options: ['CEO', 'CTO', 'Gerente', 'Analista', 'Outro'],
    order: 3
  },
  {
    id: 'pain_point',
    name: 'Principal Dor',
    type: 'textarea',
    required: false,
    order: 4
  }
];

// Mock Messages
const generateMockMessages = (conversationId: string): Message[] => [
  {
    id: `${conversationId}_1`,
    conversationId,
    content: 'Olá! Vi vocês no Instagram e fiquei interessado nos seus produtos.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    sender: 'lead',
    status: 'read',
    type: 'text'
  },
  {
    id: `${conversationId}_2`,
    conversationId,
    content: 'Olá! Que ótimo que você nos encontrou! Como podemos te ajudar?',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5h atrás
    sender: 'user',
    status: 'read',
    type: 'text'
  },
  {
    id: `${conversationId}_3`,
    conversationId,
    content: 'Preciso de uma solução para gestão da minha equipe de vendas.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h atrás
    sender: 'lead',
    status: 'read',
    type: 'text'
  },
  {
    id: `${conversationId}_4`,
    conversationId,
    content: 'Perfeito! Temos exatamente o que você precisa. Posso te enviar uma proposta personalizada?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30min atrás
    sender: 'user',
    status: 'delivered',
    type: 'text'
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    leadId: '1',
    channel: 'whatsapp',
    messages: generateMockMessages('conv_1'),
    status: 'active',
    unreadCount: 0
  },
  {
    id: 'conv_2',
    leadId: '2',
    channel: 'instagram',
    messages: generateMockMessages('conv_2'),
    status: 'active',
    unreadCount: 2
  }
];

// Mock Activities
const generateMockActivities = (leadId: string): Activity[] => [
  {
    id: `activity_${leadId}_1`,
    leadId,
    type: 'created',
    description: 'Lead criado',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    userId: '2'
  },
  {
    id: `activity_${leadId}_2`,
    leadId,
    type: 'message_received',
    description: 'Mensagem recebida via WhatsApp',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    userId: '2'
  },
  {
    id: `activity_${leadId}_3`,
    leadId,
    type: 'stage_changed',
    description: 'Movido para Qualificando',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h atrás
    userId: '2'
  }
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '+55 11 99999-9999',
    value: 15000,
    stage: defaultPipelineStages[1], // Qualificando
    source: 'whatsapp',
    assignedTo: '2',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000),
    followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // amanhã
    tags: ['enterprise', 'high-priority'],
    priority: 'high' as const,
    temperature: 'hot' as const,
    conversations: mockConversations.filter(c => c.leadId === '1'),
    activities: generateMockActivities('1')
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@startup.com',
    phone: '+55 11 88888-8888',
    value: 8500,
    stage: defaultPipelineStages[0], // Novo Lead
    source: 'instagram',
    assignedTo: '3',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 30 * 60 * 1000),
    followUpDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // hoje em 2h
    tags: ['startup', 'medium-priority'],
    priority: 'medium' as const,
    temperature: 'warm' as const,
    conversations: mockConversations.filter(c => c.leadId === '2'),
    activities: generateMockActivities('2')
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro@consultoria.com',
    phone: '+55 11 77777-7777',
    value: 25000,
    stage: defaultPipelineStages[2], // Proposta
    source: 'referral',
    assignedTo: '2',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 4 * 60 * 60 * 1000),
    followUpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // ontem (atrasado)
    tags: ['enterprise', 'hot-lead'],
    priority: 'urgent' as const,
    temperature: 'hot' as const,
    conversations: [],
    activities: generateMockActivities('3')
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@ecommerce.com',
    phone: '+55 11 66666-6666',
    value: 12000,
    stage: defaultPipelineStages[3], // Fechamento
    source: 'website',
    assignedTo: '1',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 1 * 60 * 60 * 1000),
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // próxima semana
    tags: ['ecommerce', 'ready-to-close'],
    priority: 'high' as const,
    temperature: 'hot' as const,
    conversations: [],
    activities: generateMockActivities('4')
  },
  // Leads frios para demonstrar funcionalidades
  {
    id: '5',
    name: 'Carlos Ferreira',
    email: 'carlos@email.com',
    value: 3000,
    stage: defaultPipelineStages[0],
    source: 'whatsapp',
    assignedTo: '2',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás (frio)
    followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // atrasado há 2 dias
    priority: 'low' as const,
    temperature: 'cold' as const,
    conversations: [],
    activities: generateMockActivities('5')
  }
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: 'whatsapp_integration',
    name: 'WhatsApp Business',
    type: 'whatsapp',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
    config: {
      phoneNumber: '+55 11 99999-0000',
      businessName: 'CRM Pro'
    }
  },
  {
    id: 'instagram_integration',
    name: 'Instagram Business',
    type: 'instagram',
    status: 'connected',
    lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 min atrás
    config: {
      accountName: '@crmpro_oficial',
      accessToken: 'xxxx-xxxx-xxxx'
    }
  },
  {
    id: 'phone_integration',
    name: 'Sistema de Telefonia',
    type: 'phone',
    status: 'disconnected',
    config: {}
  }
];

// Mock Account
export const mockAccount: Account = {
  id: 'account_1',
  name: 'CRM Pro Empresa',
  domain: 'crmpro.com',
  pipeline: defaultPipelineStages,
  customFields: mockCustomFields,
  integrations: mockIntegrations,
  settings: {
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    language: 'pt',
    dateFormat: 'DD/MM/YYYY'
  }
};