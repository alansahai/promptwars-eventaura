import React, { useState, useMemo } from 'react';
import type { BudgetCategory, Currency } from '../../types/event';
import { formatCurrency } from '../../utils/currency';

interface DonutChartProps {
  categories: BudgetCategory[];
  currency: Currency;
}

export const DonutChart: React.FC<DonutChartProps> = ({ categories, currency }) => {
  const [hoveredCategory, setHoveredCategory] = useState<BudgetCategory | null>(null);

  // SVG dimensions
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative offsets immutably
  const totalAllocated = useMemo(
    () => categories.reduce((sum, c) => sum + c.allocatedAmount, 0),
    [categories]
  );

  const slices = useMemo(() => {
    return categories.reduce<{
      slices: Array<{ cat: BudgetCategory; percent: number; strokeDasharray: string; strokeDashoffset: number }>;
      acc: number;
    }>(
      (state, cat) => {
        const percent = totalAllocated > 0 ? cat.allocatedAmount / totalAllocated : 0;
        const strokeDasharray = `${percent * circumference} ${circumference}`;
        const strokeDashoffset = -state.acc * circumference;
        return {
          slices: [
            ...state.slices,
            { cat, percent, strokeDasharray, strokeDashoffset },
          ],
          acc: state.acc + percent,
        };
      },
      { slices: [], acc: 0 }
    ).slices;
  }, [categories, totalAllocated, circumference]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {slices.map(({ cat, strokeDasharray, strokeDashoffset }) => {
            const isHovered = hoveredCategory?.id === cat.id;
            return (
              <circle
                key={cat.id}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  opacity: hoveredCategory && !isHovered ? 0.4 : 1,
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 'none',
                }}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center Hover/Summary Display */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '1rem',
          }}
        >
          {hoveredCategory ? (
            <div className="animate-fade-in">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {hoveredCategory.name}
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: hoveredCategory.color, fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(hoveredCategory.allocatedAmount, currency)}
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                {hoveredCategory.percentage}% of Budget
              </span>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Allocated</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(totalAllocated, currency)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {categories.length} Categories
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
