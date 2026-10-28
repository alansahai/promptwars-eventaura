import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { TimelineView } from '../../components/timeline/TimelineView';
import { EventProvider } from '../../context/EventContext';

describe('TimelineView Component', () => {
  it('renders milestone timeline header', () => {
    render(
      <EventProvider>
        <TimelineView />
      </EventProvider>
    );
    expect(screen.getByText(/Milestone Timeline/i)).toBeInTheDocument();
  });

  it('renders progress bar with accessible role and ARIA attributes', () => {
    render(
      <EventProvider>
        <TimelineView />
      </EventProvider>
    );
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-label');
  });

  it('shows overall milestone progress label', () => {
    render(
      <EventProvider>
        <TimelineView />
      </EventProvider>
    );
    expect(screen.getByText('Overall Milestone Progress')).toBeInTheDocument();
  });

  it('renders task toggle checkbox buttons with aria-labels', () => {
    render(
      <EventProvider>
        <TimelineView />
      </EventProvider>
    );
    const toggleBtns = screen.getAllByRole('button', { name: /Mark task/i });
    expect(toggleBtns.length).toBeGreaterThan(0);
  });
});
