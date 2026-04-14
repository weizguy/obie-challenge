import type { Request, Response } from 'express';
import { getTabByName, getTabData, clearCache } from '../services/sheetsService';

export const getTab = async (req: Request, res: Response) => {
  const gid = req.params.gid as string;
  try {
    const data = await getTabData(gid);
    res.json(data);
  } catch (error) {
    console.error('Sheets error:', error);
    res.status(500).json({ message: 'Failed to fetch sheet data' });
  }
};

export const getTabByTabName = async (req: Request, res: Response) => {
  const tabName = req.params.tabName as string;
  try {
    const data = await getTabByName(tabName);
    res.json(data);
  } catch (error) {
    console.error('Sheets error:', error);
    res.status(500).json({ message: 'Failed to fetch sheet data' });
  }
};

export const refreshCache = (req: Request, res: Response) => {
  clearCache();
  res.json({ message: 'Cache cleared, data will be re-fetched on next request' });
};