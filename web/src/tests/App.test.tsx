import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer.tsx';

describe('Web footer', () => {
  it('renders the UniBoard footer copy', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText(/Built for Students, Built for Trust/i)).toBeInTheDocument();
  });
});
