import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { WhatIfSimulator } from '../../components/scenario/WhatIfSimulator';
import { EventProvider } from '../../context/EventContext';

describe('WhatIfSimulator Component', () => {
  it('renders slider controls and recalculation triggers', () => {
    render(
      <EventProvider>
        <WhatIfSimulator />
      </EventProvider>
    );

    // Verify main header via regex to account for curly quotes
    expect(screen.getByText(/Dynamic Scenario Simulator/i)).toBeInTheDocument();

    // Verify control labels
    expect(screen.getByText('Guest Count Shift')).toBeInTheDocument();
    expect(screen.getByText('Budget Modification')).toBeInTheDocument();

    // Verify Apply Scenario Shift button
    expect(screen.getByText('Recalculate & Apply Plan Shift')).toBeInTheDocument();
  });

  it('all range sliders have accessible aria-label attributes', () => {
    render(
      <EventProvider>
        <WhatIfSimulator />
      </EventProvider>
    );
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(3);

    const guestSlider = screen.getByLabelText(/Guest count change/i);
    expect(guestSlider).toBeInTheDocument();

    const budgetSlider = screen.getByLabelText(/Budget percentage change/i);
    expect(budgetSlider).toBeInTheDocument();

    const dateSlider = screen.getByLabelText(/Days to accelerate event date/i);
    expect(dateSlider).toBeInTheDocument();
  });

  it('renders preset quick-select buttons', () => {
    render(
      <EventProvider>
        <WhatIfSimulator />
      </EventProvider>
    );
    expect(screen.getByText(/Budget Crunch/i)).toBeInTheDocument();
    expect(screen.getByText(/Family Expansion/i)).toBeInTheDocument();
  });
});

