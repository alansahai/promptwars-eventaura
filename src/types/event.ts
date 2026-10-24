export type EventType = 'wedding' | 'birthday' | 'community' | 'anniversary' | 'corporate';

export type EventVibe = 'luxury' | 'rustic' | 'minimalist' | 'traditional' | 'modern-chic' | 'festive';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface PriorityWeights {
  venue: number;        // 1 to 5
  catering: number;     // 1 to 5
  photography: number;  // 1 to 5
  decor: number;        // 1 to 5
  entertainment: number;// 1 to 5
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  allocatedAmount: number;
  spentAmount: number;
  color: string;
  icon: string;
  notes: string;
  tradeoffAdvice?: string;
  isCustom?: boolean;
}

export interface BudgetPlan {
  totalBudget: number;
  currency: Currency;
  contingencyPercent: number;
  contingencyAmount: number;
  allocatedTotal: number;
  remainingAmount: number;
  categories: BudgetCategory[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type MilestonePhase = 'early_prep' | 'vendor_lock' | 'details_invites' | 'final_countdown' | 'day_of';

export interface TimelineTask {
  id: string;
  title: string;
  category: string;
  milestonePhase: MilestonePhase;
  phaseLabel: string;
  daysBeforeEvent: number;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies?: string[];
  dependencyNames?: string[];
  assignedTo?: string;
  aiTip?: string;
}

export interface RunOfShowItem {
  id: string;
  time: string;
  activity: string;
  leadPerson: string;
  location: string;
  notes: string;
  completed: boolean;
}

export interface VendorQuote {
  id: string;
  vendorName: string;
  category: string;
  quotedPrice: number;
  perGuestRate?: number;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  rating: number; // 1 to 5
  status: 'evaluating' | 'shortlisted' | 'booked' | 'declined';
  pros: string[];
  cons: string[];
  hiddenChargesWarning?: string;
}

export interface VendorVettingQuestion {
  id: string;
  category: string;
  question: string;
  whyItMatters: string;
  dealbreakerAlert: boolean;
}

export interface PersonalizedIdea {
  id: string;
  title: string;
  conceptDescription: string;
  tag: 'Theme & Palette' | 'Culinary Experience' | 'Guest Engagement' | 'Atmosphere & Decor' | 'Entertainment & Memories';
  estimatedCostImpact: 'low' | 'medium' | 'high';
  accessibilityConsideration?: string;
  suggestedVendors?: string[];
}

export interface EventDetails {
  id: string;
  title: string;
  type: EventType;
  vibe: EventVibe;
  targetDate: string; // ISO date string YYYY-MM-DD
  guestCount: number;
  currency: Currency;
  totalBudget: number;
  location: string;
  specialNeeds: string;
  dietaryPreferences: string[];
  priorities: PriorityWeights;
}

export interface ScenarioShift {
  guestCountDelta: number;
  budgetPercentDelta: number;
  daysOffsetDelta: number;
  description: string;
  appliedAt?: string;
}

export interface TradeOffOption {
  id: string;
  title: string;
  description: string;
  budgetDelta: number;
  pros: string[];
  cons: string[];
  affectedCategories: { categoryId: string; newPercentage: number; deltaAmount: number }[];
}

export interface EventPlan {
  details: EventDetails;
  budget: BudgetPlan;
  tasks: TimelineTask[];
  runOfShow: RunOfShowItem[];
  vendorQuotes: VendorQuote[];
  vettingQuestions: VendorVettingQuestion[];
  ideas: PersonalizedIdea[];
  tradeOffOptions?: TradeOffOption[];
  scenarioHistory: ScenarioShift[];
  lastUpdated: string;
}
