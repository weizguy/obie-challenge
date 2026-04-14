import request from 'supertest';
import express from 'express';
import sheetsRoutes from '../routes/sheetsRoutes';

const app = express();
app.use(express.json());
app.use('/api/sheets', sheetsRoutes);

jest.mock('../services/sheetsService', () => ({
  getTabByName: jest.fn(),
  getTabData: jest.fn(),
  clearCache: jest.fn(),
}));

import { getTabByName, getTabData } from '../services/sheetsService';

const mockAutoData = [
  { Carrier: 'Allstate', IL: 'BOTH', IN: 'BOTH', MI: '' },
  { Carrier: 'Hippo', IL: 'FIRE', IN: 'FIRE', MI: 'FIRE' },
];

const mockFloodData = [
  { Carrier: 'National General', IL: 'Yes', IN: 'Yes', MI: 'Yes' },
  { Carrier: 'Neptune', IL: 'No', IN: 'Yes', MI: 'Yes' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GET /api/sheets/name/:tabName', () => {
  it('returns 200 with data for a valid tab name', async () => {
    (getTabByName as jest.Mock).mockResolvedValue(mockAutoData);
    const res = await request(app).get('/api/sheets/name/auto');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns correct carrier data', async () => {
    (getTabByName as jest.Mock).mockResolvedValue(mockAutoData);
    const res = await request(app).get('/api/sheets/name/auto');
    expect(res.body[0].Carrier).toBe('Allstate');
  });

  it('returns 500 when service throws', async () => {
    (getTabByName as jest.Mock).mockRejectedValue(new Error('Tab not found'));
    const res = await request(app).get('/api/sheets/name/invalid');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Failed to fetch sheet data');
  });

  it('returns flood tab data', async () => {
    (getTabByName as jest.Mock).mockResolvedValue(mockFloodData);
    const res = await request(app).get('/api/sheets/name/flood');
    expect(res.status).toBe(200);
    expect(res.body[0].Carrier).toBe('National General');
  });
});

describe('GET /api/sheets/gid/:gid', () => {
  it('returns 200 with data for a valid gid', async () => {
    (getTabData as jest.Mock).mockResolvedValue(mockAutoData);
    const res = await request(app).get('/api/sheets/gid/137794754');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns 500 when service throws', async () => {
    (getTabData as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    const res = await request(app).get('/api/sheets/gid/invalid');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Failed to fetch sheet data');
  });
});

describe('POST /api/sheets/refresh', () => {
  it('returns 200 and clears the cache', async () => {
    const res = await request(app).post('/api/sheets/refresh');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Cache cleared, data will be re-fetched on next request');
  });
});