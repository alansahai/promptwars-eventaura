import type { EventDetails, EventPlan, ScenarioShift } from '../types/event';
import { generateSimulatedPlan, recalculateScenarioShift } from './simulationEngine';

// Key retrieval: Session storage or Vite environment variable (Never hardcoded!)
const STORAGE_KEY = 'event_aura_gemini_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  const sessionKey = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  if (sessionKey) return sessionKey;
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string, persist: boolean = false): void {
  if (typeof window === 'undefined') return;
  if (!key) {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  if (persist) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    sessionStorage.setItem(STORAGE_KEY, key.trim());
  }
}

/**
 * Main plan generator.
 * If API Key is present, calls Google Gemini API.
 * If not present or call fails, seamlessly leverages simulationEngine.
 */
export async function generateEventPlan(details: EventDetails): Promise<{ plan: EventPlan; source: 'gemini' | 'simulation'; message?: string }> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Deterministic simulation fallback
    const simulated = generateSimulatedPlan(details);
    return {
      plan: simulated,
      source: 'simulation',
      message: 'Generated using EventAura Intelligent Engine (Add Gemini API key in settings for live cloud generation).',
    };
  }

  try {
    const prompt = `
You are EventAura, an elite celebration and event planning orchestrator.
Plan a realistic, interconnected, and constraint-aware event plan for the following user requirements:
Event Type: ${details.type}
Title: ${details.title}
Vibe/Theme: ${details.vibe}
Date: ${details.targetDate}
Guest Count: ${details.guestCount}
Total Budget: ${details.currency} ${details.totalBudget}
Location: ${details.location}
Special Needs / Accessibility: ${details.specialNeeds || 'Standard'}
Dietary Preferences: ${details.dietaryPreferences.join(', ') || 'Standard'}
Priority Weights (1-5): Venue: ${details.priorities.venue}, Food: ${details.priorities.catering}, Photography: ${details.priorities.photography}, Decor: ${details.priorities.decor}, Entertainment: ${details.priorities.entertainment}

Respond strictly in valid JSON matching this schema structure:
{
  "contingencyPercent": number,
  "categories": [
    { "id": string, "name": string, "percentage": number, "allocatedAmount": number, "color": string, "icon": string, "notes": string, "tradeoffAdvice": string }
  ],
  "tasks": [
    { "id": string, "title": string, "category": string, "milestonePhase": "early_prep"|"vendor_lock"|"details_invites"|"final_countdown"|"day_of", "phaseLabel": string, "daysBeforeEvent": number, "status": "todo"|"in_progress"|"completed", "priority": "high"|"medium"|"low", "assignedTo": string, "aiTip": string, "dependencyNames": string[] }
  ],
  "ideas": [
    { "id": string, "title": string, "conceptDescription": string, "tag": "Theme & Palette"|"Culinary Experience"|"Guest Engagement"|"Atmosphere & Decor"|"Entertainment & Memories", "estimatedCostImpact": "low"|"medium"|"high", "accessibilityConsideration": string }
  ],
  "vettingQuestions": [
    { "id": string, "category": string, "question": string, "whyItMatters": string, "dealbreakerAlert": boolean }
  ]
}
Do NOT wrap in markdown backticks or any other text. Output pure JSON only.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Falling back to simulation engine.`);
      return {
        plan: generateSimulatedPlan(details),
        source: 'simulation',
        message: `Cloud API returned status ${response.status}. Simulation engine generated this plan.`,
      };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean any backticks if model generated them
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Merge with full event structure
    const fallback = generateSimulatedPlan(details);

    const contingencyPercent = parsed.contingencyPercent || fallback.budget.contingencyPercent;
    const contingencyAmount = Math.round((details.totalBudget * contingencyPercent) / 100);
    const effectiveBudget = details.totalBudget - contingencyAmount;

    const categories = (parsed.categories || fallback.budget.categories).map((c: any, index: number) => ({
      ...c,
      id: c.id || `cat-${index}`,
      spentAmount: 0,
      color: c.color || fallback.budget.categories[index % fallback.budget.categories.length]?.color || '#F59E0B',
      icon: c.icon || 'Sparkles',
    }));

    const plan: EventPlan = {
      details,
      budget: {
        totalBudget: details.totalBudget,
        currency: details.currency,
        contingencyPercent,
        contingencyAmount,
        allocatedTotal: categories.reduce((s: number, c: any) => s + c.allocatedAmount, 0),
        remainingAmount: effectiveBudget - categories.reduce((s: number, c: any) => s + c.allocatedAmount, 0),
        categories,
      },
      tasks: parsed.tasks?.length ? parsed.tasks : fallback.tasks,
      runOfShow: fallback.runOfShow,
      vendorQuotes: fallback.vendorQuotes,
      vettingQuestions: parsed.vettingQuestions?.length ? parsed.vettingQuestions : fallback.vettingQuestions,
      ideas: parsed.ideas?.length ? parsed.ideas : fallback.ideas,
      tradeOffOptions: fallback.tradeOffOptions,
      scenarioHistory: [],
      lastUpdated: new Date().toISOString(),
    };

    return { plan, source: 'gemini', message: 'Successfully generated using Google Gemini 1.5 Flash.' };
  } catch (error) {
    console.error('Gemini API call failed, falling back to local simulation:', error);
    return {
      plan: generateSimulatedPlan(details),
      source: 'simulation',
      message: 'Cloud generation unavailable; generated using EventAura Intelligent Engine.',
    };
  }
}

/**
 * Executes a "What-If" scenario recalculation
 */
export async function executeScenarioShift(
  currentPlan: EventPlan,
  shift: ScenarioShift
): Promise<EventPlan> {
  // Scenario shift uses the deterministic recalculation engine
  return recalculateScenarioShift(currentPlan, shift);
}
