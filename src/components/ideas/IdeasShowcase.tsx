import React, { useState } from 'react';
import { Lightbulb, HeartHandshake } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const IdeasShowcase: React.FC = () => {
  const { plan } = useEvent();
  const { ideas, details } = plan;
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = Array.from(new Set(ideas.map((i) => i.tag)));

  const filteredIdeas = ideas.filter(
    (i) => selectedTag === 'all' || i.tag === selectedTag
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Personalized Thematic Concepts</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Tailored creative hooks designed specifically for {details.type} ({details.vibe} vibe) with accessibility awareness.
          </p>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTag('all')}
          className={`btn ${selectedTag === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
        >
          <span>All Concepts ({ideas.length})</span>
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`btn ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            <span>{tag}</span>
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="glass-panel flex flex-col justify-between"
            style={{
              padding: '1.5rem',
              borderTop: '3px solid var(--accent-gold)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                  {idea.tag}
                </span>
                <span
                  className={`badge ${
                    idea.estimatedCostImpact === 'low'
                      ? 'badge-emerald'
                      : idea.estimatedCostImpact === 'medium'
                      ? 'badge-indigo'
                      : 'badge-rose'
                  }`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {idea.estimatedCostImpact} Cost Impact
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', margin: '0.4rem 0', fontFamily: 'var(--font-heading)' }}>
                {idea.title}
              </h4>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                {idea.conceptDescription}
              </p>
            </div>

            {idea.accessibilityConsideration && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.78rem',
                  color: '#6EE7B7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <HeartHandshake size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Inclusivity Highlight: </strong>
                  {idea.accessibilityConsideration}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
