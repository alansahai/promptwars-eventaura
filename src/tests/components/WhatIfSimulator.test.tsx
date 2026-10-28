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
});
