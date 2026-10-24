import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Printer,
  Sparkles,
  SlidersHorizontal,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { formatCurrency } from '../../utils/currency';

export const OverviewHeader: React.FC = () => {
  const { plan, setActiveTab } = useEvent();
  const { details, budget, tasks, ideas } = plan;

  // Calculate days remaining until event
  const today = new Date();
  const eventDate = new Date(details.targetDate);
  const diffTime = eventDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Tasks completed count
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Print / Export Dossier
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(26, 34, 53, 0.85) 0%, rgba(18, 26, 44, 0.95) 100%)',
          border: '1px solid var(--border-glow)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div className="flex items-start justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
                {details.type}
              </span>
              <span className="badge badge-indigo" style={{ textTransform: 'capitalize' }}>
                {details.vibe} Vibe
              </span>
              <span className="badge badge-emerald">
                <Clock size={12} />
                <span>{daysRemaining > 0 ? `T - ${daysRemaining} Days` : 'Event Day!'}</span>
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)', marginBottom: '0.5rem' }}>
              {details.title}
            </h1>

            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div className="flex items-center gap-1">
                <Calendar size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>{new Date(details.targetDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} style={{ color: 'var(--accent-indigo)' }} />
                <span>{details.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span>{details.guestCount} Guests Confirmed</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 no-print" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('whatif')}
              className="btn btn-primary animate-glow"
              style={{ fontSize: '0.9rem' }}
            >
              <SlidersHorizontal size={17} />
              <span>Simulate “What-If” Shift</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
              title="Generate printable client dossier or save as PDF"
            >
              <Printer size={17} />
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Accessibility & Inclusivity Callout Banner */}
        {details.specialNeeds && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <HeartHandshake size={20} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem' }}>
              <strong style={{ color: '#A5B4FC' }}>Inclusivity & Accessibility Accommodations: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{details.specialNeeds}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Quick Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {/* Budget Metric */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('budget')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Allocated Budget</span>
            <span className="badge badge-gold">{details.currency}</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)' }}>
            {formatCurrency(budget.totalBudget, details.currency)}
          </div>
          <div className="flex items-center justify-between mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Buffer: {formatCurrency(budget.contingencyAmount, details.currency)}</span>
            <span style={{ color: 'var(--accent-emerald)' }}>Balanced</span>
          </div>
        </div>

        {/* Per-Guest Economics */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('budget')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Per-Guest Economics</span>
            <span className="badge badge-emerald">Efficiency</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-emerald)' }}>
            {formatCurrency(Math.round(budget.totalBudget / details.guestCount), details.currency)}
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Across {details.guestCount} guests (venue + catering + decor)
          </p>
        </div>

        {/* Timeline Completion */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('timeline')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Planning Progress</span>
            <span className="badge badge-indigo">{progressPercent}%</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {completedTasks} / {tasks.length}
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              marginTop: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--accent-indigo-gradient)',
                transition: 'width var(--transition-normal)',
              }}
            />
          </div>
        </div>

        {/* Vendor Quotes Evaluated */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('vendors')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vendor Intelligence</span>
            <span className="badge badge-slate">Vetted Quotes</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#A5B4FC' }}>
            {plan.vendorQuotes.length} Quotes
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {plan.vettingQuestions.length} AI negotiation probes active
          </p>
        </div>
      </div>

      {/* Featured GenAI Concept Spotlight */}
      {ideas.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>GenAI Signature Concept Spotlight</h3>
            </div>
            <button
              onClick={() => setActiveTab('ideas')}
              className="btn btn-ghost"
              style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
            >
              <span>View All ({ideas.length}) Ideas &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {ideas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                className="glass-card"
                style={{
                  borderLeft: '4px solid var(--accent-gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem', marginBottom: '0.5rem' }}>
                    {idea.tag}
                  </span>
                  <h4 style={{ fontSize: '1rem', margin: '0.4rem 0' }}>{idea.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {idea.conceptDescription}
                  </p>
                </div>
                {idea.accessibilityConsideration && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6EE7B7' }}>
                    ♿ {idea.accessibilityConsideration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
