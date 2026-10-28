import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  DollarSign,
  Calendar,
  History,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import { formatCurrency } from '../../utils/currency';
import type { ScenarioShift } from '../../types/event';

export const WhatIfSimulator: React.FC = () => {
  const { plan, applyShift, isLoading } = useEvent();
  const { details, scenarioHistory } = plan;

  // Simulator state
  const [guestDelta, setGuestDelta] = useState<number>(50);
  const [budgetPercentDelta, setBudgetPercentDelta] = useState<number>(-10);
  const [daysOffsetDelta, setDaysOffsetDelta] = useState<number>(14); // 14 days earlier

  // Projected metrics
  const projectedGuests = Math.max(10, details.guestCount + guestDelta);
  const projectedBudget = Math.max(
    10000,
    Math.round(details.totalBudget * (1 + budgetPercentDelta / 100))
  );
  const budgetDiffAmount = projectedBudget - details.totalBudget;

  const handleApplyShift = async () => {
    const shift: ScenarioShift = {
      guestCountDelta: guestDelta,
      budgetPercentDelta: budgetPercentDelta,
      daysOffsetDelta: daysOffsetDelta,
      description: `Applied Shift: ${guestDelta >= 0 ? '+' : ''}${guestDelta} guests, ${budgetPercentDelta >= 0 ? '+' : ''}${budgetPercentDelta}% budget, ${daysOffsetDelta >= 0 ? '+' : ''}${daysOffsetDelta} days earlier`,
    };
    await applyShift(shift);
  };

  const loadPreset = (g: number, b: number, d: number) => {
    setGuestDelta(g);
    setBudgetPercentDelta(b);
    setDaysOffsetDelta(d);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderLeft: '4px solid var(--accent-gold)',
          background: 'linear-gradient(135deg, rgba(26, 34, 53, 0.85) 0%, rgba(18, 26, 44, 0.95) 100%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-gold">PromptWars Challenge Highlight</span>
          <span className="badge badge-indigo">Dynamic Adaptability</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          The “What-If” Dynamic Scenario Simulator
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '850px', lineHeight: 1.6 }}>
          Real life events never follow the initial plan. When family members add guests or budgets tighten, EventAura’s
          interconnected recalculation engine adapts your allocations, deadlines, and vendor priorities instantly without starting over.
        </p>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
          <button
            onClick={() => loadPreset(50, -10, 14)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            ⭐ The Explainer Challenge (+50 Guests, -10% Budget, -14 Days)
          </button>
          <button
            onClick={() => loadPreset(80, 15, 0)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            👥 Family Expansion (+80 Guests, +15% Budget)
          </button>
          <button
            onClick={() => loadPreset(0, -20, 0)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            💰 Budget Crunch (-20% Budget Cut)
          </button>
          <button
            onClick={() => loadPreset(0, 0, 21)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            ⚡ Fast-Track (Moved 3 Weeks Earlier)
          </button>
        </div>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guest Count Modifier */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Guest Count Shift</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Current: {details.guestCount} guests
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: guestDelta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {guestDelta >= 0 ? `+${guestDelta}` : guestDelta} guests
              </span>
              <span className="badge badge-emerald">
                Projected: {projectedGuests}
              </span>
            </div>

            <input
              type="range"
              min="-100"
              max="200"
              step="5"
              value={guestDelta}
              onChange={(e) => setGuestDelta(Number(e.target.value))}
              aria-label="Guest count change"
              aria-valuetext={`${guestDelta >= 0 ? '+' : ''}${guestDelta} guests, projected total: ${projectedGuests}`}
              style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Budget Modifier */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} style={{ color: 'var(--accent-gold)' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Budget Modification</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Current: {formatCurrency(details.totalBudget, details.currency)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: budgetPercentDelta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {budgetPercentDelta >= 0 ? `+${budgetPercentDelta}%` : `${budgetPercentDelta}%`}
              </span>
              <span className="badge badge-gold">
                {formatCurrency(projectedBudget, details.currency)}
              </span>
            </div>

            <input
              type="range"
              min="-40"
              max="50"
              step="5"
              value={budgetPercentDelta}
              onChange={(e) => setBudgetPercentDelta(Number(e.target.value))}
              aria-label="Budget percentage change"
              aria-valuetext={`${budgetPercentDelta >= 0 ? '+' : ''}${budgetPercentDelta}%, projected budget: ${projectedBudget}`}
              style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Timeline Compression */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} style={{ color: 'var(--accent-indigo)' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Timeline Compression</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Shift event date earlier
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A5B4FC' }}>
                {daysOffsetDelta > 0 ? `${daysOffsetDelta} days earlier` : 'No date change'}
              </span>
              <span className="badge badge-indigo">
                Accelerate
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="45"
              step="7"
              value={daysOffsetDelta}
              onChange={(e) => setDaysOffsetDelta(Number(e.target.value))}
              aria-label="Days to accelerate event date"
              aria-valuetext={daysOffsetDelta > 0 ? `${daysOffsetDelta} days earlier` : 'No date change'}
              style={{ width: '100%', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Impact Assessment Card */}
      <div className="glass-panel p-6">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recalculation Impact Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Guest Capacity Impact</span>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                {details.guestCount} &rarr; {projectedGuests}
              </span>
              {guestDelta !== 0 && (
                <span className={`badge ${guestDelta > 0 ? 'badge-rose' : 'badge-emerald'}`}>
                  {guestDelta > 0 ? `+${guestDelta} plates` : `${guestDelta} plates`}
                </span>
              )}
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Catering and seating capacity automatically re-proportioned.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Financial Variance</span>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                {formatCurrency(budgetDiffAmount, details.currency)}
              </span>
              <span className={`badge ${budgetDiffAmount >= 0 ? 'badge-emerald' : 'badge-rose'}`}>
                {budgetPercentDelta}%
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {budgetPercentDelta < 0 ? 'Decor & non-essentials compressed to protect dining.' : 'Extra funds buffered into entertainment & photo.'}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deadline Pressure</span>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: daysOffsetDelta > 0 ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                {daysOffsetDelta > 0 ? `-${daysOffsetDelta} Days Buffer` : 'Normal Schedule'}
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tasks occurring within 14 days will be automatically flagged as critical high priority.
            </p>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Executes instantaneous recalculation without page reload.
          </span>
          <button
            onClick={handleApplyShift}
            disabled={isLoading}
            className="btn btn-primary animate-glow"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            <Sparkles size={18} />
            <span>{isLoading ? 'Recalculating Plan...' : 'Recalculate & Apply Plan Shift'}</span>
          </button>
        </div>
      </div>

      {/* History of Previous Shifts */}
      {scenarioHistory.length > 0 && (
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-3">
            <History size={18} style={{ color: 'var(--accent-gold)' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Scenario Evolution Audit Log</h4>
          </div>
          <div className="flex flex-col gap-2">
            {scenarioHistory.map((h, idx) => (
              <div
                key={idx}
                className="glass-card flex items-center justify-between"
                style={{ padding: '0.65rem 1rem', fontSize: '0.82rem' }}
              >
                <span>{h.description}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{h.appliedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
