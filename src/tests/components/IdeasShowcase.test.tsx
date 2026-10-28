import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { IdeasShowcase } from '../../components/ideas/IdeasShowcase';
import { EventProvider } from '../../context/EventContext';

describe('IdeasShowcase Component', () => {
  it('renders thematic concepts header and idea cards', () => {
    render(
      <EventProvider>
        <IdeasShowcase />
      </EventProvider>
    );

    // Verify main header
    expect(screen.getByText('Personalized Thematic Concepts')).toBeInTheDocument();

    // Verify all concepts filter button exists
    expect(screen.getByText(/All Concepts/i)).toBeInTheDocument();

    // Verify at least one idea card title is present
    expect(screen.getByText(/Acoustic Welcome/i)).toBeInTheDocument();
  });
});
