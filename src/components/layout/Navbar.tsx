import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  Sun,
  Moon,
  PlusCircle,
  Check,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    apiKey,
    setIsApiKeyModalOpen,
    setIsWizardOpen,
    loadSample,
    plan,
  } = useEvent();

  const [sampleMenuOpen, setSampleMenuOpen] = useState(false);

  return (
    <header
      className="glass-panel no-print"
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 40,
        margin: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container flex items-center justify-between"
        style={{ padding: '0.85rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #F8FAFC 30%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                EventAura
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                PromptWars Round 5
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              GenAI Celebration & Life-Event Orchestrator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
          {/* Preset Demonstrations Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSampleMenuOpen(!sampleMenuOpen)}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem' }}
              aria-expanded={sampleMenuOpen}
              aria-haspopup="true"
            >
              <Layers size={16} />
              <span>Demos & Presets</span>
              <ChevronDown size={14} />
            </button>

            {sampleMenuOpen && (
              <div
                className="glass-modal animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '240px',
                  padding: '0.5rem',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <button
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '0.85rem' }}
                  onClick={() => {
                    loadSample('wedding');
                    setSampleMenuOpen(false);
                  }}
                >
                  <span>🏰 Royal Jaipur Wedding</span>
                  {plan.details.type === 'wedding' && <Check size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '0.85rem' }}
                  onClick={() => {
                    loadSample('birthday');
                    setSampleMenuOpen(false);
                  }}
                >
                  <span>🎂 50th Golden Jubilee</span>
                  {plan.details.type === 'birthday' && <Check size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '0.85rem' }}
                  onClick={() => {
                    loadSample('community');
                    setSampleMenuOpen(false);
                  }}
                >
                  <span>🌱 Community Eco-Fest</span>
                  {plan.details.type === 'community' && <Check size={14} style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }} />}
                </button>
              </div>
            )}
          </div>

          {/* AI Status / Key Button */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem' }}
            title={apiKey ? 'Google Gemini API connected' : 'Intelligent Simulation Engine active'}
          >
            <Key size={15} style={{ color: apiKey ? 'var(--accent-emerald)' : 'var(--accent-gold)' }} />
            <span>{apiKey ? 'Gemini Active' : 'AI Engine (Offline Ready)'}</span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: apiKey ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                display: 'inline-block',
              }}
            />
          </button>

          {/* Plan New Event Wizard Trigger */}
          <button
            onClick={() => setIsWizardOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem', padding: '0.55rem 1.1rem' }}
          >
            <PlusCircle size={16} />
            <span>+ Plan New Event</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-gold)' }} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
