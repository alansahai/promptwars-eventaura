import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../../components/layout/Navbar';
import { EventProvider } from '../../context/EventContext';

describe('Navbar Component', () => {
  it('renders application branding, round badge, and actions', () => {
    render(
      <EventProvider>
        <Navbar />
      </EventProvider>
    );

    // Verify brand title
    expect(screen.getByText('EventAura')).toBeInTheDocument();

    // Verify PromptWars badge
    expect(screen.getByText('PromptWars Round 5')).toBeInTheDocument();

    // Verify GenAI orchestrator subtext
    expect(screen.getByText('GenAI Celebration & Life-Event Orchestrator')).toBeInTheDocument();

    // Verify Demos & Presets trigger
    expect(screen.getByText('Demos & Presets')).toBeInTheDocument();

    // Verify Plan New Event button
    expect(screen.getByText('+ Plan New Event')).toBeInTheDocument();
  });
});
