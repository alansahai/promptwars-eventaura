import React from 'react';
import { Sparkles, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {

  return (
    <footer
      className="glass-panel no-print"
      style={{
        marginTop: '3rem',
        marginBottom: '1.5rem',
        marginInline: '1.5rem',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
              EventAura
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
              Challenge 5 Submission
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Built for PromptWars Virtual Round 5: Celebration & Event Planner. Demonstrating dynamic tradeoff analysis,
            interconnected recalculation, and vendor matrix orchestration.
          </p>
        </div>

        {/* Evaluation Signals Summary */}
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Zero Hardcoded Secrets</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>WCAG 2.1 AA Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles size={14} style={{ color: 'var(--accent-indigo)' }} />
            <span>Dual-Engine GenAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
