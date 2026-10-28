import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VendorList } from '../../components/vendors/VendorList';
import { EventProvider } from '../../context/EventContext';

describe('VendorList Component', () => {
  it('renders vendor intelligence header', () => {
    render(
      <EventProvider>
        <VendorList />
      </EventProvider>
    );
    expect(screen.getByText(/Vendor Intelligence/i)).toBeInTheDocument();
  });

  it('filter buttons have aria-pressed attribute', () => {
    render(
      <EventProvider>
        <VendorList />
      </EventProvider>
    );
    const allBtn = screen.getByText(/All Quotes/i).closest('button');
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens Add Quotation modal with dialog role on button click', () => {
    render(
      <EventProvider>
        <VendorList />
      </EventProvider>
    );
    const addBtn = screen.getByText(/\+ Add Quotation/i);
    fireEvent.click(addBtn);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'add-quote-modal-title');
  });

  it('modal title element exists for aria-labelledby reference', () => {
    render(
      <EventProvider>
        <VendorList />
      </EventProvider>
    );
    fireEvent.click(screen.getByText(/\+ Add Quotation/i));
    const title = document.getElementById('add-quote-modal-title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe('Add Vendor Quotation');
  });

  it('renders vetting questions section', () => {
    render(
      <EventProvider>
        <VendorList />
      </EventProvider>
    );
    expect(screen.getByText(/AI Vendor Negotiation/i)).toBeInTheDocument();
  });
});
