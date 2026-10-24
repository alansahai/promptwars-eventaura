import { describe, it, expect } from 'vitest';
import { generateSimulatedPlan } from '../services/simulationEngine';
import type { EventDetails } from '../types/event';

describe('Budget Allocation & Financial Engine', () => {
  const mockWeddingDetails: EventDetails = {
    id: 'test-wedding-1',
    title: 'Test Wedding',
    type: 'wedding',
    vibe: 'traditional',
    targetDate: '2026-12-25',
    guestCount: 200,
    currency: 'INR',
    totalBudget: 1000000,
    location: 'Jaipur',
    specialNeeds: 'None',
    dietaryPreferences: ['Vegetarian'],
    priorities: {
      venue: 5,
      catering: 5,
      photography: 4,
      decor: 3,
      entertainment: 3,
    },
  };

  it('calculates proper contingency buffer and effective budget', () => {
    const plan = generateSimulatedPlan(mockWeddingDetails);
    expect(plan.budget.totalBudget).toBe(1000000);
    expect(plan.budget.contingencyPercent).toBe(6);
    expect(plan.budget.contingencyAmount).toBe(60000);

    const effectiveBudget = plan.budget.totalBudget - plan.budget.contingencyAmount;
    expect(effectiveBudget).toBe(940000);
  });

  it('allocates categories whose total matches effective budget', () => {
    const plan = generateSimulatedPlan(mockWeddingDetails);
    const sumAllocated = plan.budget.categories.reduce((s, c) => s + c.allocatedAmount, 0);
    const effectiveBudget = plan.budget.totalBudget - plan.budget.contingencyAmount;

    // Allocated amount should be within 1% margin of effective budget due to integer rounding
    expect(Math.abs(sumAllocated - effectiveBudget)).toBeLessThan(10000);
  });

  it('weights catering and venue higher when user priority is 5', () => {
    const plan = generateSimulatedPlan(mockWeddingDetails);
    const cateringCat = plan.budget.categories.find((c) => c.name.toLowerCase().includes('catering'));
    const venueCat = plan.budget.categories.find((c) => c.name.toLowerCase().includes('venue'));
    const decorCat = plan.budget.categories.find((c) => c.name.toLowerCase().includes('decor'));

    expect(cateringCat).toBeDefined();
    expect(venueCat).toBeDefined();
    expect(decorCat).toBeDefined();

    expect(cateringCat!.allocatedAmount).toBeGreaterThan(decorCat!.allocatedAmount);
    expect(venueCat!.allocatedAmount).toBeGreaterThan(decorCat!.allocatedAmount);
  });
});
