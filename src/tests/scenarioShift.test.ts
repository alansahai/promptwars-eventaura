import { describe, it, expect } from 'vitest';
import { generateSimulatedPlan, recalculateScenarioShift } from '../services/simulationEngine';
import type { EventDetails, ScenarioShift } from '../types/event';

describe('What-If Scenario Recalculation Engine', () => {
  const initialDetails: EventDetails = {
    id: 'test-event-shift',
    title: 'Pooja & Rohan Wedding',
    type: 'wedding',
    vibe: 'traditional',
    targetDate: '2026-11-30',
    guestCount: 200,
    currency: 'INR',
    totalBudget: 1500000,
    location: 'Delhi',
    specialNeeds: 'Ramp',
    dietaryPreferences: ['Veg'],
    priorities: { venue: 4, catering: 4, photography: 4, decor: 4, entertainment: 3 },
  };

  it('re-calculates plan dynamically when +50 guests and -10% budget occur', () => {
    const basePlan = generateSimulatedPlan(initialDetails);

    const shift: ScenarioShift = {
      guestCountDelta: 50,
      budgetPercentDelta: -10,
      daysOffsetDelta: 14,
      description: 'Explainer Scenario Test',
    };

    const updatedPlan = recalculateScenarioShift(basePlan, shift);

    // 1. Guest count updated
    expect(updatedPlan.details.guestCount).toBe(250);

    // 2. Budget compressed by 10%
    expect(updatedPlan.details.totalBudget).toBe(1350000);

    // 3. Scenario history recorded
    expect(updatedPlan.scenarioHistory.length).toBe(1);

    // 4. Tasks updated with urgency flags if within 14 days
    const urgentTasks = updatedPlan.tasks.filter((t) => t.priority === 'high');
    expect(urgentTasks.length).toBeGreaterThan(0);
  });

  it('handles negative guest count shift gracefully without dropping below minimum', () => {
    const basePlan = generateSimulatedPlan(initialDetails);

    const shift: ScenarioShift = {
      guestCountDelta: -300, // extreme reduction
      budgetPercentDelta: 0,
      daysOffsetDelta: 0,
      description: 'Intimate scale down',
    };

    const updatedPlan = recalculateScenarioShift(basePlan, shift);
    expect(updatedPlan.details.guestCount).toBeGreaterThanOrEqual(10);
  });
});
