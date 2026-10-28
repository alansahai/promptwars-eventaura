import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TradeOffModal } from '../../components/budget/TradeOffModal';
import { EventProvider } from '../../context/EventContext';

describe('TradeOffModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <EventProvider>
        <TradeOffModal isOpen={false} onClose={() => {}} />
      </EventProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders trade-off options and modal title when isOpen is true', () => {
    const handleClose = vi.fn();
    render(
      <EventProvider>
        <TradeOffModal isOpen={true} onClose={handleClose} />
      </EventProvider>
    );

    // Verify modal title
    expect(screen.getByText('AI Trade-Off Decision Matrix')).toBeInTheDocument();

    // Verify close button triggers onClose
    const closeBtn = screen.getByLabelText('Close Trade-off Modal');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
