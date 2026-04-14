import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders the logo with the correct src', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toHaveAttribute('src', '/logo.png');
  });
});

export {};