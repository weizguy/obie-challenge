import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CarrierSearch from './CarrierSearch';

global.fetch = jest.fn();

const mockAutoData = [
  { Carrier: 'Allstate', IL: 'BOTH', IN: 'BOTH', MI: '' },
  { Carrier: 'Hippo', IL: 'FIRE', IN: 'FIRE', MI: 'FIRE' },
  { Carrier: 'Progressive', IL: 'AUTO', IN: 'BOTH', MI: 'AUTO' },
  { Carrier: 'Seneca', IL: 'BOTH', IN: 'FIRE', MI: 'AUTO' },
];

const mockFloodData = [
  { Carrier: 'National General', IL: 'Yes', IN: 'Yes', MI: 'Yes' },
  { Carrier: 'Neptune', IL: 'No', IN: 'Yes', MI: 'Yes' },
  { Carrier: 'Seneca', IL: 'Yes', IN: 'Yes', MI: 'Yes' },
];

const selectState = (value: string) => {
  fireEvent.change(screen.getByDisplayValue('Select a State'), { target: { value } });
};

const selectCoverage = (value: string) => {
  fireEvent.change(screen.getByDisplayValue('Select Coverage Type'), { target: { value } });
};

const clickSearch = () => fireEvent.click(screen.getByText('Search'));

const mockFetchSuccess = (data: any[]) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

const mockFetchFailure = () => {
  (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CarrierSearch - Rendering', () => {
  it('renders state and coverage dropdowns', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Select a State')).toBeInTheDocument();
    expect(screen.getByText('Select Coverage Type')).toBeInTheDocument();
  });

  it('renders full state names in dropdown', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Illinois')).toBeInTheDocument();
    expect(screen.getByText('Indiana')).toBeInTheDocument();
    expect(screen.getByText('Michigan')).toBeInTheDocument();
  });

  it('renders coverage type options', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Flood')).toBeInTheDocument();
  });
});

describe('CarrierSearch - Search Button', () => {
  it('is disabled when no dropdowns are selected', () => {
    render(<CarrierSearch />);
    expect(screen.getByText('Search')).toBeDisabled();
  });

  it('is disabled when only state is selected', () => {
    render(<CarrierSearch />);
    selectState('IL');
    expect(screen.getByText('Search')).toBeDisabled();
  });

  it('is disabled when only coverage is selected', () => {
    render(<CarrierSearch />);
    selectCoverage('Auto');
    expect(screen.getByText('Search')).toBeDisabled();
  });

  it('is enabled when both dropdowns are selected', () => {
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    expect(screen.getByText('Search')).not.toBeDisabled();
  });
});

describe('CarrierSearch - No Results Message', () => {
  it('does not show no results message before searching', () => {
    render(<CarrierSearch />);
    expect(screen.queryByText(/No carriers found/)).not.toBeInTheDocument();
  });

  it('does not show no results message when only state is selected', () => {
    render(<CarrierSearch />);
    selectState('IL');
    expect(screen.queryByText(/No carriers found/)).not.toBeInTheDocument();
  });

  it('shows no results message after search with no matches', async () => {
    mockFetchSuccess([{ Carrier: 'Hippo', IL: 'FIRE', IN: 'FIRE', MI: 'FIRE' }]);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('No carriers found for IL - Auto')).toBeInTheDocument();
    });
  });
});

describe('CarrierSearch - Auto/Fire Filtering', () => {
  it('shows carriers where state column is AUTO', async () => {
    mockFetchSuccess(mockAutoData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('Progressive')).toBeInTheDocument();
    });
  });

  it('shows carriers where state column is BOTH', async () => {
    mockFetchSuccess(mockAutoData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('Allstate')).toBeInTheDocument();
    });
  });

  it('hides carriers where state column is FIRE when searching Auto', async () => {
    mockFetchSuccess(mockAutoData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.queryByText('Hippo')).not.toBeInTheDocument();
    });
  });

  it('hides carriers where state column is empty', async () => {
    mockFetchSuccess(mockAutoData);
    render(<CarrierSearch />);
    selectState('MI');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.queryByText('Allstate')).not.toBeInTheDocument();
    });
  });
});

describe('CarrierSearch - Flood Filtering', () => {
  it('shows carriers where state column is Yes', async () => {
    mockFetchSuccess(mockFloodData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Flood');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('National General')).toBeInTheDocument();
      expect(screen.getByText('Seneca')).toBeInTheDocument();
    });
  });

  it('hides carriers where state column is No', async () => {
    mockFetchSuccess(mockFloodData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Flood');
    clickSearch();
    await waitFor(() => {
      expect(screen.queryByText('Neptune')).not.toBeInTheDocument();
    });
  });
});

describe('CarrierSearch - Error Handling', () => {
  it('shows error message when API call fails', async () => {
    mockFetchFailure();
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('Failed to load carriers. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears error message on subsequent successful search', async () => {
    mockFetchFailure();
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('Failed to load carriers. Please try again.')).toBeInTheDocument();
    });

    mockFetchSuccess(mockAutoData);
    clickSearch();
    await waitFor(() => {
      expect(screen.queryByText('Failed to load carriers. Please try again.')).not.toBeInTheDocument();
    });
  });
});

describe('CarrierSearch - API Call', () => {
  it('calls the API with the correct coverage type', async () => {
    mockFetchSuccess(mockFloodData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Flood');
    clickSearch();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/sheets/name/Flood');
    });
  });

  it('sends the two character state code to the filter, not the full name', async () => {
    mockFetchSuccess(mockAutoData);
    render(<CarrierSearch />);
    selectState('IL');
    selectCoverage('Auto');
    clickSearch();
    await waitFor(() => {
      expect(screen.getByText('Allstate')).toBeInTheDocument();
    });
  });
});