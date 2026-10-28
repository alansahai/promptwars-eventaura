import { describe, it, expect, beforeEach } from 'vitest';
import { generateEventPlan, getStoredApiKey, setStoredApiKey } from '../services/geminiService';
import type { EventDetails } from '../types/event';

describe('Gemini Resilience & Fallback Service', () => {
  const sampleDetails: EventDetails = {
    id: 'test-event-resilience',
    title: 'Silver Jubilee Gala',
    type: 'community',
    vibe: 'modern-chic',
    targetDate: '2026-11-20',
    guestCount: 150,
    currency: 'USD',
    totalBudget: 45000,
    location: 'San Francisco',
    specialNeeds: 'Wheelchair access',
    dietaryPreferences: ['Vegan', 'Gluten-Free'],
    priorities: { venue: 5, catering: 4, photography: 4, decor: 3, entertainment: 5 },
  };

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('falls back seamlessly to local engine when no API key is present', async () => {
    const response = await generateEventPlan(sampleDetails);
    expect(response).toBeDefined();
    expect(response.source).toBe('simulation');
    expect(response.plan.details.title).toBe('Silver Jubilee Gala');
    expect(response.plan.budget.categories.length).toBeGreaterThan(0);
    expect(response.plan.tasks.length).toBeGreaterThan(0);
    expect(response.plan.ideas.length).toBeGreaterThan(0);
  });

  it('properly saves and retrieves ephemeral API key in sessionStorage', () => {
    setStoredApiKey('AIzaSyTestKey123', false);
    const retrieved = getStoredApiKey();
    expect(retrieved).toBe('AIzaSyTestKey123');
    expect(localStorage.getItem('event_aura_gemini_key')).toBeNull();
  });

  it('persists API key in localStorage when persist flag is true', () => {
    setStoredApiKey('AIzaSyPersistentKey456', true);
    const retrieved = getStoredApiKey();
    expect(retrieved).toBe('AIzaSyPersistentKey456');
    expect(localStorage.getItem('event_aura_gemini_key')).toBe('AIzaSyPersistentKey456');
  });
});
