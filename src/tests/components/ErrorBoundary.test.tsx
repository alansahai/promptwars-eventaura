import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const ProblemChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test Explosion Failure');
  }
  return <div>Safe Child Content</div>;
};

describe('ErrorBoundary Component', () => {
  it('renders children normally when no errors occur', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
  });

  it('catches render errors and renders a friendly recovery alert', () => {
    // Suppress expected console.error during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom Section Failure">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Custom Section Failure')).toBeInTheDocument();
    expect(screen.getByText('Test Explosion Failure')).toBeInTheDocument();
    expect(screen.getByText('Retry Section')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('triggers onReset callback when Retry button is clicked', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onResetMock = vi.fn();

    render(
      <ErrorBoundary onReset={onResetMock}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Retry Section'));
    expect(onResetMock).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
