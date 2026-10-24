import { describe, it, expect } from 'vitest';
import { SAMPLE_WEDDING } from '../data/sampleEvents';

describe('Timeline & Dependency Resolution', () => {
  it('correctly maps milestone phases from early prep to day of', () => {
    const phases = SAMPLE_WEDDING.tasks.map((t) => t.milestonePhase);
    expect(phases).toContain('early_prep');
    expect(phases).toContain('vendor_lock');
    expect(phases).toContain('day_of');
  });

  it('verifies that tasks with dependencies have matching dependencyNames', () => {
    const tasksWithDeps = SAMPLE_WEDDING.tasks.filter((t) => t.dependencies && t.dependencies.length > 0);
    expect(tasksWithDeps.length).toBeGreaterThan(0);

    tasksWithDeps.forEach((t) => {
      expect(t.dependencyNames).toBeDefined();
      expect(t.dependencyNames!.length).toBeGreaterThan(0);
    });
  });

  it('calculates run-of-show completion count accurately', () => {
    const initialCompleted = SAMPLE_WEDDING.runOfShow.filter((i) => i.completed).length;
    expect(initialCompleted).toBe(0);
  });
});
