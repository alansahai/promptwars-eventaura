import React from 'react';
import { X, Check, Scale } from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { formatCurrency } from '../../utils/currency';

interface TradeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeOffModal: React.FC<TradeOffModalProps> = ({ isOpen, onClose }) => {
  const { plan, applyTradeOff } = useEvent();
  const { tradeOffOptions = [], details } = plan;

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tradeoff-modal-title"
    >
      <div
        className="glass-modal p-6 w-full max-w-2xl"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          className="btn-ghost"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.4rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          aria-label="Close Trade-off Modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-indigo)',
            }}
          >
            <Scale size={26} />
          </div>
          <div>
            <h3 id="tradeoff-modal-title" style={{ margin: 0, fontSize: '1.4rem' }}>
              AI Trade-Off Decision Matrix
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Intelligently navigate compromises without sacrificing what matters most to your family.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <strong>SME Guideline: </strong>
          Rather than imposing arbitrary cost cuts, EventAura outlines multiple vetted scenarios comparing guest satisfaction, visual legacy, and cost savings.
        </div>

        {tradeOffOptions.length === 0 ? (
          <div className="text-center p-8">
            <p style={{ color: 'var(--text-muted)' }}>
              Your current budget is well-balanced! Trade-off strategies activate when expenses exceed limits or when simulating budget compressions.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tradeOffOptions.map((opt) => (
              <div
                key={opt.id}
                className="glass-card flex flex-col gap-3"
                style={{
                  borderLeft: '4px solid var(--accent-indigo)',
                  background: 'rgba(15, 23, 42, 0.7)',
                }}
              >
                <div className="flex items-start justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{opt.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                      {opt.description}
                    </p>
                  </div>
                  <span
                    className={`badge ${opt.budgetDelta < 0 ? 'badge-emerald' : 'badge-gold'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {opt.budgetDelta < 0
                      ? `Saves ${formatCurrency(Math.abs(opt.budgetDelta), details.currency)}`
                      : 'Zero Net Delta'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3" style={{ fontSize: '0.8rem' }}>
                  <div>
                    <strong style={{ color: 'var(--accent-emerald)' }}>✓ Advantages:</strong>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      {opt.pros.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--accent-rose)' }}>⚠️ Trade-Off:</strong>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      {opt.cons.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Re-allocates {opt.affectedCategories.length} category budgets automatically
                  </span>
                  <button
                    onClick={() => {
                      applyTradeOff(opt.id);
                      onClose();
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
                  >
                    <Check size={14} />
                    <span>Apply Strategy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
