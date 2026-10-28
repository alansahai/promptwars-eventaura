import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  Scale,
  Info,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import { formatCurrency } from '../../utils/currency';
import { DonutChart } from './DonutChart';
import { TradeOffModal } from './TradeOffModal';

export const BudgetOverview: React.FC = () => {
  const { plan, updateCategories } = useEvent();
  const { budget, details } = plan;
  const [isTradeOffOpen, setIsTradeOffOpen] = useState(false);

  const effectiveBudget = budget.totalBudget - budget.contingencyAmount;
  const totalAllocated = budget.categories.reduce((s, c) => s + c.allocatedAmount, 0);
  const isOverBudget = totalAllocated > effectiveBudget;
  const overAmount = totalAllocated - effectiveBudget;

  const handlePercentageChange = (catId: string, newPercentage: number) => {
    const updated = budget.categories.map((c) => {
      if (c.id === catId) {
        const allocatedAmount = Math.round((newPercentage / 100) * effectiveBudget);
        return {
          ...c,
          percentage: newPercentage,
          allocatedAmount,
        };
      }
      return c;
    });
    updateCategories(updated);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Warning Banner if Over Budget */}
      {isOverBudget && (
        <div
          role="alert"
          aria-live="assertive"
          className="glass-card animate-glow"
          style={{
            borderColor: 'var(--accent-rose)',
            background: 'rgba(244, 63, 94, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} style={{ color: 'var(--accent-rose)' }} />
            <div>
              <strong style={{ color: '#FDA4AF', fontSize: '1rem' }}>
                Budget Exceeded by {formatCurrency(overAmount, details.currency)}!
              </strong>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Total allocations exceed available funds after reserve buffer. Explore AI Trade-Off options to re-balance.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTradeOffOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Scale size={16} />
            <span>Explore AI Trade-Offs</span>
          </button>
        </div>
      )}

      {/* Main Grid: Chart + High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Left: Interactive Donut Chart */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <PieChart size={18} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Resource Partitioning</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 1rem 0' }}>
            Hover slices to inspect categorized allocations and percentages
          </p>
          <DonutChart
            categories={budget.categories}
            currency={details.currency}
          />
        </div>

        {/* Right: Budget Statistics & Emergency Buffer */}
        <div className="md:col-span-2 glass-panel p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Financial Architecture</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Total Cap: {formatCurrency(budget.totalBudget, details.currency)} across {details.guestCount} guests
                </p>
              </div>

              <button
                onClick={() => setIsTradeOffOpen(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <Scale size={16} style={{ color: 'var(--accent-indigo)' }} />
                <span>Trade-Off Advisor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="glass-card" style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Effective Budget</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(effectiveBudget, details.currency)}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available for vendors</span>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Contingency Buffer ({budget.contingencyPercent}%)</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {formatCurrency(budget.contingencyAmount, details.currency)}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Safeguard against overrun</span>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Estimated Per-Guest Spend</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {formatCurrency(Math.round(effectiveBudget / details.guestCount), details.currency)}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based on {details.guestCount} headcount</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Info size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <span>
              <strong>Dynamic Consequence Tracking: </strong>
              Increasing one category dynamically reduces remaining headroom. Use the sliders below to fine-tune your target allocations.
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Allocation Sliders */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Categorized Allocations & Spending</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Adjust target percentages or track actual advance payments made to vendors.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {budget.categories.map((cat) => {
            return (
              <div
                key={cat.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  borderLeft: `4px solid ${cat.color}`,
                }}
              >
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: cat.color,
                      }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{cat.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {cat.notes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(cat.allocatedAmount, details.currency)}
                      </div>
                      <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                        {cat.percentage}% of total
                      </span>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '110px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spent / Paid</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: cat.spentAmount > cat.allocatedAmount ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                        {formatCurrency(cat.spentAmount, details.currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Slider */}
                <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '60px' }}>
                    Adjust: {cat.percentage}%
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={cat.percentage}
                    onChange={(e) => handlePercentageChange(cat.id, Number(e.target.value))}
                    aria-label={`${cat.name} budget allocation percentage`}
                    aria-valuetext={`${cat.percentage}% — ${formatCurrency(cat.allocatedAmount, details.currency)}`}
                    style={{ flex: 1, accentColor: cat.color, cursor: 'pointer' }}
                  />
                  {cat.tradeoffAdvice && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', maxWidth: '350px' }}>
                      💡 {cat.tradeoffAdvice}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trade-off Modal */}
      <TradeOffModal isOpen={isTradeOffOpen} onClose={() => setIsTradeOffOpen(false)} />
    </div>
  );
};
