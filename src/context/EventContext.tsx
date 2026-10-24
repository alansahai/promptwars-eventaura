import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  EventPlan,
  EventDetails,
  TaskStatus,
  BudgetCategory,
  VendorQuote,
  ScenarioShift,
} from '../types/event';
import { SAMPLE_WEDDING, SAMPLE_BIRTHDAY, SAMPLE_COMMUNITY } from '../data/sampleEvents';
import { generateEventPlan, executeScenarioShift, getStoredApiKey, setStoredApiKey } from '../services/geminiService';

export type TabType = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'whatif' | 'runofshow';

interface EventContextType {
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

const STORAGE_EVENT_KEY = 'event_aura_active_plan';
const STORAGE_THEME_KEY = 'event_aura_theme';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<EventPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_EVENT_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return SAMPLE_WEDDING;
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generationSource, setGenerationSource] = useState<'gemini' | 'simulation' | 'preloaded'>('preloaded');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Initialize theme and API key
  useEffect(() => {
    const savedTheme = (localStorage.getItem(STORAGE_THEME_KEY) as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setApiKey(getStoredApiKey());
  }, []);

  // Sync plan to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_EVENT_KEY, JSON.stringify(plan));
    }
  }, [plan]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
  };

  const saveApiKey = (key: string, persist: boolean) => {
    setStoredApiKey(key, persist);
    setApiKey(key.trim());
    setIsApiKeyModalOpen(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#6366F1', '#10B981', '#EC4899'],
    });
  };

  const loadSample = (type: 'wedding' | 'birthday' | 'community') => {
    setIsLoading(true);
    setLoadingMessage(`Loading ${type.toUpperCase()} showcase plan...`);
    setTimeout(() => {
      if (type === 'wedding') setPlan(SAMPLE_WEDDING);
      else if (type === 'birthday') setPlan(SAMPLE_BIRTHDAY);
      else setPlan(SAMPLE_COMMUNITY);
      setGenerationSource('preloaded');
      setIsLoading(false);
      triggerConfetti();
    }, 300);
  };

  const createPlan = async (details: EventDetails) => {
    setIsLoading(true);
    setLoadingMessage('GenAI is analyzing priorities, allocating budget, and scheduling timeline...');
    try {
      const result = await generateEventPlan(details);
      setPlan(result.plan);
      setGenerationSource(result.source);
      setIsWizardOpen(false);
      setActiveTab('overview');
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyShift = async (shift: ScenarioShift) => {
    setIsLoading(true);
    setLoadingMessage('Dynamic Scenario Engine recalculating budget allocations and timeline bottlenecks...');
    try {
      const updated = await executeScenarioShift(plan, shift);
      setPlan(updated);
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setPlan((prev) => {
      const updatedTasks = prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
      return { ...prev, tasks: updatedTasks, lastUpdated: new Date().toISOString() };
    });
    if (status === 'completed') {
      triggerConfetti();
    }
  };

  const updateCategories = (categories: BudgetCategory[]) => {
    setPlan((prev) => {
      const allocatedTotal = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
      const remainingAmount = prev.budget.totalBudget - prev.budget.contingencyAmount - allocatedTotal;
      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories,
          allocatedTotal,
          remainingAmount,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const addVendorQuote = (quote: VendorQuote) => {
    setPlan((prev) => ({
      ...prev,
      vendorQuotes: [quote, ...prev.vendorQuotes],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateVendorStatus = (quoteId: string, status: VendorQuote['status']) => {
    setPlan((prev) => ({
      ...prev,
      vendorQuotes: prev.vendorQuotes.map((q) => (q.id === quoteId ? { ...q, status } : q)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const toggleRunOfShowItem = (itemId: string) => {
    setPlan((prev) => ({
      ...prev,
      runOfShow: prev.runOfShow.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const applyTradeOff = (tradeoffId: string) => {
    const trade = plan.tradeOffOptions?.find((t) => t.id === tradeoffId);
    if (!trade) return;

    setPlan((prev) => {
      const updatedCategories = prev.budget.categories.map((cat) => {
        const change = trade.affectedCategories.find((a) => a.categoryId === cat.id);
        if (change) {
          return {
            ...cat,
            percentage: change.newPercentage,
            allocatedAmount: cat.allocatedAmount + change.deltaAmount,
          };
        }
        return cat;
      });

      const allocatedTotal = updatedCategories.reduce((s, c) => s + c.allocatedAmount, 0);
      const remainingAmount = prev.budget.totalBudget - prev.budget.contingencyAmount - allocatedTotal;

      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories: updatedCategories,
          allocatedTotal,
          remainingAmount,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
    triggerConfetti();
  };

  return (
    <EventContext.Provider
      value={{
        plan,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        isLoading,
        loadingMessage,
        generationSource,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isWizardOpen,
        setIsWizardOpen,
        apiKey,
        saveApiKey,
        loadSample,
        createPlan,
        applyShift,
        updateTaskStatus,
        updateCategories,
        addVendorQuote,
        updateVendorStatus,
        toggleRunOfShowItem,
        applyTradeOff,
        triggerConfetti,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
