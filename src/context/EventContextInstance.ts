import { createContext } from 'react';
import type {
  EventPlan,
  EventDetails,
  TaskStatus,
  BudgetCategory,
  VendorQuote,
  ScenarioShift,
} from '../types/event';

export type TabType = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'whatif' | 'runofshow';

export interface EventContextType {
  plan: EventPlan;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;
  loadingMessage: string;
  generationSource: 'gemini' | 'simulation' | 'preloaded';
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  apiKey: string;
  saveApiKey: (key: string, persist: boolean) => void;
  loadSample: (type: 'wedding' | 'birthday' | 'community') => void;
  createPlan: (details: EventDetails) => Promise<void>;
  applyShift: (shift: ScenarioShift) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateCategories: (categories: BudgetCategory[]) => void;
  addVendorQuote: (quote: VendorQuote) => void;
  updateVendorStatus: (quoteId: string, status: VendorQuote['status']) => void;
  toggleRunOfShowItem: (itemId: string) => void;
  applyTradeOff: (tradeoffId: string) => void;
  triggerConfetti: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);
