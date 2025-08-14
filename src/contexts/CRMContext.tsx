import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lead, PipelineStage, User, Integration, Account } from '@/types';
import { 
  mockLeads, 
  mockUsers, 
  mockIntegrations, 
  mockAccount,
  defaultPipelineStages 
} from '@/data/mockData';

interface CRMContextType {
  // Data
  leads: Lead[];
  users: User[];
  integrations: Integration[];
  account: Account;
  pipelineStages: PipelineStage[];
  
  // Selected States
  selectedLead: Lead | null;
  
  // Actions
  setSelectedLead: (lead: Lead | null) => void;
  updateLeadStage: (leadId: string, stageId: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  
  // Utility functions
  getLeadsByStage: (stageId: string) => Lead[];
  getTotalValueByStage: (stageId: string) => number;
  getLeadCount: () => number;
  getTotalPipelineValue: () => number;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

interface CRMProviderProps {
  children: React.ReactNode;
}

export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [integrations] = useState<Integration[]>(mockIntegrations);
  const [account] = useState<Account>(mockAccount);
  const [pipelineStages] = useState<PipelineStage[]>(defaultPipelineStages);

  const updateLeadStage = useCallback((leadId: string, stageId: string) => {
    setLeads(currentLeads => 
      currentLeads.map(lead => {
        if (lead.id === leadId) {
          const newStage = pipelineStages.find(stage => stage.id === stageId);
          if (newStage) {
            return {
              ...lead,
              stage: newStage,
              updatedAt: new Date()
            };
          }
        }
        return lead;
      })
    );
  }, [pipelineStages]);

  const addLead = useCallback((newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const lead: Lead = {
      ...newLead,
      id: `lead_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setLeads(currentLeads => [...currentLeads, lead]);
  }, []);

  const updateLead = useCallback((leadId: string, updates: Partial<Lead>) => {
    setLeads(currentLeads =>
      currentLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, ...updates, updatedAt: new Date() }
          : lead
      )
    );
    
    // Update selected lead if it's the one being updated
    if (selectedLead?.id === leadId) {
      setSelectedLead(current => current ? { ...current, ...updates, updatedAt: new Date() } : null);
    }
  }, [selectedLead]);

  const deleteLead = useCallback((leadId: string) => {
    setLeads(currentLeads => currentLeads.filter(lead => lead.id !== leadId));
    if (selectedLead?.id === leadId) {
      setSelectedLead(null);
    }
  }, [selectedLead]);

  const getLeadsByStage = useCallback((stageId: string) => {
    return leads.filter(lead => lead.stage.id === stageId);
  }, [leads]);

  const getTotalValueByStage = useCallback((stageId: string) => {
    return getLeadsByStage(stageId).reduce((total, lead) => total + lead.value, 0);
  }, [getLeadsByStage]);

  const getLeadCount = useCallback(() => {
    return leads.length;
  }, [leads]);

  const getTotalPipelineValue = useCallback(() => {
    return leads.reduce((total, lead) => total + lead.value, 0);
  }, [leads]);

  const value: CRMContextType = {
    // Data
    leads,
    users,
    integrations,
    account,
    pipelineStages,
    
    // Selected States
    selectedLead,
    
    // Actions
    setSelectedLead,
    updateLeadStage,
    addLead,
    updateLead,
    deleteLead,
    
    // Utility functions
    getLeadsByStage,
    getTotalValueByStage,
    getLeadCount,
    getTotalPipelineValue
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};