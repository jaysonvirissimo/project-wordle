import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header', () => {
  it('renders the application title', () => {
    render(<Header />);

    const heading = screen.getByRole('heading', { name: /verbula/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Verbula');
  });
});
