import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Link2,
  Filter,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import type { TaskStatus, MilestonePhase } from '../../types/event';

export const TimelineView: React.FC = () => {
  const { plan, updateTaskStatus } = useEvent();
  const { tasks } = plan;
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  // Group tasks by milestone phase
  const phases: { phase: MilestonePhase; label: string; desc: string }[] = [
    { phase: 'early_prep', label: 'Phase 1: Early Lock (Essentials)', desc: 'Dates, Primary Venue, Guest Count Draft' },
    { phase: 'vendor_lock', label: 'Phase 2: Core Vendor Lock', desc: 'Catering Tasting, Photography, Sound & Stage' },
    { phase: 'details_invites', label: 'Phase 3: Invitations & Outreach', desc: 'Send Invites, Attire Fittings, Menu Freeze' },
    { phase: 'final_countdown', label: 'Phase 4: Final Countdown (2 Weeks Out)', desc: 'RSVP Lock, Seating Plan, Vendor Walkthrough' },
    { phase: 'day_of', label: 'Phase 5: Day-Of Run-of-Show', desc: 'Minute-by-minute execution and coordinator checklist' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending') return t.status !== 'completed';
    if (filterStatus === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header and Filter Controls */}
      <div className="glass-panel p-6 flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Dependency-Aware Milestone Timeline</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Turn vague goals into prioritized, sequential tasks with AI risk tips and dependency management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 glass-card" style={{ padding: '0.35rem 0.6rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Tasks ({totalCount})</option>
              <option value="pending">Pending ({totalCount - completedCount})</option>
              <option value="completed">Completed ({completedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between mb-2" style={{ fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600 }}>Overall Milestone Progress</span>
          <span className="badge badge-indigo">{progressPercent}% Locked</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-full)',
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

      {/* Sequential Phase Groups */}
      <div className="flex flex-col gap-6">
        {phases.map(({ phase, label, desc }) => {
          const phaseTasks = filteredTasks.filter((t) => t.milestonePhase === phase);
          if (phaseTasks.length === 0) return null;

          return (
            <div key={phase} className="glass-panel p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                    {label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {phaseTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className="glass-card flex flex-col gap-2"
                      style={{
                        padding: '1rem 1.25rem',
                        borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : undefined,
                        background: isDone ? 'rgba(16, 185, 129, 0.04)' : undefined,
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div className="flex items-start justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => updateTaskStatus(task.id, isDone ? 'todo' : 'completed')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
                              marginTop: '2px',
                            }}
                            aria-label={`Mark task ${task.title} as ${isDone ? 'incomplete' : 'completed'}`}
                          >
                            {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: '1rem',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                }}
                              >
                                {task.title}
                              </h4>
                              <span
                                className={`badge ${
                                  task.priority === 'high'
                                    ? 'badge-rose'
                                    : task.priority === 'medium'
                                    ? 'badge-gold'
                                    : 'badge-slate'
                                }`}
                                style={{ fontSize: '0.65rem' }}
                              >
                                {task.priority} Priority
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mt-1" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              <span>Category: {task.category}</span>
                              {task.assignedTo && <span>• Lead: {task.assignedTo}</span>}
                              <span>• {task.daysBeforeEvent > 0 ? `${task.daysBeforeEvent} days before` : 'Day-Of'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1">
                          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateTaskStatus(task.id, st)}
                              className={`btn ${task.status === st ? 'btn-primary' : 'btn-ghost'}`}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.25rem 0.55rem',
                                textTransform: 'capitalize',
                              }}
                            >
                              {st.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dependencies Display */}
                      {task.dependencyNames && task.dependencyNames.length > 0 && (
                        <div
                          className="flex items-center gap-2 mt-1"
                          style={{ fontSize: '0.75rem', color: '#A5B4FC' }}
                        >
                          <Link2 size={13} />
                          <span>
                            <strong>Requires Completion of: </strong>
                            {task.dependencyNames.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* AI Risk & Punctuality Tip */}
                      {task.aiTip && (
                        <div
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(245, 158, 11, 0.08)',
                            borderLeft: '3px solid var(--accent-gold)',
                            fontSize: '0.78rem',
                            color: 'var(--accent-gold-light)',
                          }}
                        >
                          <span>💡 <strong>AI Proactive Guidance: </strong>{task.aiTip}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
