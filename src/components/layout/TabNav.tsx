import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  CalendarCheck,
  Briefcase,
  Lightbulb,
  SlidersHorizontal,
  Clock,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import type { TabType } from '../../context/EventContext';

export const TabNav: React.FC = () => {
  const { activeTab, setActiveTab, plan } = useEvent();

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    {
      id: 'budget',
      label: 'Smart Budget',
      icon: <PieChart size={17} />,
      badge: `${plan.budget.categories.length}`,
    },
    {
      id: 'timeline',
      label: 'Timeline & Tasks',
      icon: <CalendarCheck size={17} />,
      badge: `${plan.tasks.filter((t) => t.status === 'completed').length}/${plan.tasks.length}`,
    },
    {
      id: 'vendors',
      label: 'Vendor Matrix',
      icon: <Briefcase size={17} />,
      badge: `${plan.vendorQuotes.length}`,
    },
    { id: 'ideas', label: 'GenAI Ideas', icon: <Lightbulb size={17} /> },
    {
      id: 'whatif',
      label: '“What-If” Simulator',
      icon: <SlidersHorizontal size={17} />,
      badge: 'SME Highlight',
      badgeColor: 'badge-gold',
    },
    { id: 'runofshow', label: 'Run of Show', icon: <Clock size={17} /> },
  ];

  return (
    <nav
      className="container no-print"
      style={{
        marginTop: '1.25rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}
      aria-label="Event Sections"
    >
      <div
        className="glass-panel flex items-center gap-1"
        style={{
          padding: '0.4rem',
          borderRadius: 'var(--radius-lg)',
          width: 'max-content',
          minWidth: '100%',
        }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                flex: '1 0 auto',
                padding: '0.65rem 1.15rem',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0F172A' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gold-gradient)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`badge ${tab.badgeColor || (isActive ? 'badge-slate' : 'badge-slate')}`}
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.15rem 0.45rem',
                    background: isActive ? 'rgba(15, 23, 42, 0.2)' : undefined,
                    color: isActive ? '#0F172A' : undefined,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
