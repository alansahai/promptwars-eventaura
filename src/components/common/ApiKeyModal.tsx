import React, { useState } from 'react';
import { Key, Shield, X, Check, ExternalLink } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, apiKey, saveApiKey } = useEvent();
  const [inputKey, setInputKey] = useState(apiKey);
  const [persist, setPersist] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKey(inputKey, persist);
  };

  const handleClear = () => {
    setInputKey('');
    saveApiKey('', false);
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div
        className="glass-modal p-6 w-full max-w-lg"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setIsApiKeyModalOpen(false)}
          className="btn-ghost"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.4rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          aria-label="Close API Key Modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-gold)',
            }}
          >
            <Key size={26} />
          </div>
          <div>
            <h3 id="api-modal-title" style={{ margin: 0, fontSize: '1.35rem' }}>
              Google Gemini API Key
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Optional & Secure Client-Side Execution
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            lineHeight: 1.5,
          }}
        >
          <div className="flex items-center gap-2 mb-1" style={{ color: '#A5B4FC', fontWeight: 600 }}>
            <Shield size={16} />
            <span>PromptWars Round 5 Security Compliance</span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Your key is <strong>never stored on any backend server</strong>. It resides strictly inside your browser's session.
            If no key is supplied, EventAura runs seamlessly on its built-in <strong>Intelligent Simulation Engine</strong> with zero quota limits!
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label htmlFor="gemini-key-input" className="input-label">
              Enter Gemini API Key (e.g. AIzaSy...)
            </label>
            <input
              id="gemini-key-input"
              type="password"
              className="input-field"
              placeholder="Paste your Gemini API key here..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="persist-checkbox"
              type="checkbox"
              checked={persist}
              onChange={(e) => setPersist(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
            />
            <label htmlFor="persist-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Remember in this browser (localStorage)
            </label>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
            >
              <span>Get Free Gemini Key</span>
              <ExternalLink size={14} />
            </a>

            <div className="flex items-center gap-2">
              {inputKey && (
                <button type="button" onClick={handleClear} className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
                  Clear
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
