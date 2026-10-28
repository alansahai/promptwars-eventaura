import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enterprise Error Boundary Component
 * Catches runtime React rendering errors gracefully and provides immediate recovery actions.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="glass-panel p-8 flex flex-col items-center justify-center text-center animate-fade-in my-6"
          style={{
            borderColor: 'var(--accent-rose)',
            background: 'linear-gradient(135deg, rgba(30, 20, 25, 0.9) 0%, rgba(18, 26, 44, 0.95) 100%)',
          }}
        >
          <div
            style={{
              padding: '1rem',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--accent-rose)',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {this.props.fallbackTitle || 'Section Temporary Recovery Mode'}
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 0 1.5rem 0' }}>
            EventAura detected an unexpected rendering issue. Your event plan state remains securely preserved in memory.
          </p>

          {this.state.error && (
            <div
              className="glass-card mb-4"
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'var(--accent-rose)',
                maxWidth: '600px',
                textAlign: 'left',
                overflowX: 'auto',
              }}
            >
              {this.state.error.message}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} />
              <span>Retry Section</span>
            </button>
            <button
              onClick={this.handleReload}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
