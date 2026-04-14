import { useState } from 'react';
import './CarrierSearch.css';

const STATES = ['IL', 'IN', 'MI'];
const COVERAGE_TYPES = ['Auto', 'Fire', 'Flood'];

interface CarrierRow {
  Carrier: string;
  IL: string;
  IN: string;
  MI: string;
}

const CarrierSearch = () => {
  const [state, setState] = useState('');
  const [coverage, setCoverage] = useState('');
  const [carriers, setCarriers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!state || !coverage) return;

    setLoading(true);
    setError('');
    setCarriers([]);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/sheets/name/${coverage}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const data: CarrierRow[] = await response.json();

      const filtered = data
        .filter(row => {
          const value = row[state as keyof CarrierRow]?.toUpperCase();
          const coverageUpper = coverage.toUpperCase();
          if (coverageUpper === 'FLOOD') return value === 'YES';
          return value === coverageUpper || value === 'BOTH';
        })
        .map(row => row.Carrier)
        .filter(Boolean);

      setCarriers(filtered);
    } catch (err) {
      setError('Failed to load carriers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Carrier Search</h1>
        <p className="subtitle">Find available carriers by state and coverage type</p>

        <div className="form">
          <div className="field">
            <label className="label">State</label>
            <select className="select" value={state} onChange={e => setState(e.target.value)}>
              <option value=''>Select a State</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Coverage Type</label>
            <select className="select" value={coverage} onChange={e => setCoverage(e.target.value)}>
              <option value=''>Select Coverage Type</option>
              {COVERAGE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            className="button"
            onClick={handleSearch}
            disabled={!state || !coverage || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {carriers.length > 0 && (
          <div className="results">
            <h2 className="results-title">Available Carriers</h2>
            <ul className="carrier-list">
              {carriers.map(carrier => (
                <li key={carrier} className="carrier-item">{carrier}</li>
              ))}
            </ul>
          </div>
        )}

        {!loading && hasSearched && carriers.length === 0 && (
          <p className="no-results">No carriers found for {state} - {coverage}</p>
        )}
      </div>
    </div>
  );
};

export default CarrierSearch;