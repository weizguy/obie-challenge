import request from 'supertest';
import express from 'express';
import sheetsRoutes from '../routes/sheetsRoutes';

const app = express();
app.use(express.json());
app.use('/api/sheets', sheetsRoutes);

jest.mock('../services/sheetsService', () => ({
  getTabByName: jest.fn().mockResolvedValue([
    { Carrier: 'Allstate', IL: 'BOTH', IN: 'BOTH', MI: '' },
    { Carrier: 'Hippo', IL: 'FIRE', IN: 'FIRE', MI: 'FIRE' },
  ]),
  getTabData: jest.fn().mockResolvedValue([]),
}));

describe('GET /api/sheets/name/:tabName', () => {
  it('returns 200 with data', async () => {
    const res = await request(app).get('/api/sheets/name/auto');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns first carrier as Allstate', async () => {
    const res = await request(app).get('/api/sheets/name/auto');
    expect(res.body[0].Carrier).toBe('Allstate');
  });
});