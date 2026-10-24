import React from 'react';
import { Clock, CheckCircle2, Circle, User, MapPin, Printer } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const RunOfShowView: React.FC = () => {
  const { plan, toggleRunOfShowItem } = useEvent();
  const { runOfShow } = plan;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="glass-panel p-6 flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Day-Of Run-of-Show Schedule</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Minute-by-minute itinerary for event directors, stage leads, anchors, and catering captains.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn btn-secondary no-print"
          style={{ fontSize: '0.85rem' }}
        >
          <Printer size={16} />
          <span>Print Clipboard Sheet</span>
        </button>
      </div>

      <div className="glass-panel p-6">
        <div className="flex flex-col gap-4">
          {runOfShow.map((item) => (
            <div
              key={item.id}
              className="glass-card flex items-start gap-4"
              style={{
                padding: '1.25rem',
                borderLeft: item.completed ? '4px solid var(--accent-emerald)' : '4px solid var(--accent-gold)',
                background: item.completed ? 'rgba(16, 185, 129, 0.04)' : undefined,
              }}
            >
              <button
                onClick={() => toggleRunOfShowItem(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: item.completed ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  marginTop: '3px',
                }}
                aria-label={`Mark ${item.activity} as ${item.completed ? 'pending' : 'completed'}`}
              >
                {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: 'var(--accent-gold)',
                      }}
                    >
                      {item.time}
                    </span>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      }}
                    >
                      {item.activity}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1">
                      <User size={13} style={{ color: 'var(--accent-indigo)' }} />
                      <span>{item.leadPerson}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={13} style={{ color: 'var(--accent-emerald)' }} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {item.notes && (
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    📝 {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
