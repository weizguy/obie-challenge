import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CarrierSearch from './CarrierSearch';

global.fetch = jest.fn();

describe('CarrierSearch', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { Carrier: 'Allstate', IL: 'BOTH', IN: 'BOTH', MI: '' },
        { Carrier: 'Hippo', IL: 'FIRE', IN: 'FIRE', MI: 'FIRE' },
      ],
    });
  });

  it('renders both dropdowns', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Select a State')).toBeInTheDocument();
    expect(screen.getByText('Select Coverage Type')).toBeInTheDocument();
  });

  it('search button is disabled until both dropdowns are selected', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Search')).toBeDisabled();
  });

  it('does not show no results message before searching', () => {
    render(<CarrierSearch />);
    expect(screen.queryByText(/No carriers found/)).not.toBeInTheDocument();
  });

  it('shows carriers after search', async () => {
    render(<CarrierSearch />);

    fireEvent.change(screen.getByDisplayValue('Select a State'), { target: { value: 'IL' } });
    fireEvent.change(screen.getByDisplayValue('Select Coverage Type'), { target: { value: 'Auto' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Allstate')).toBeInTheDocument();
    });
  });
});