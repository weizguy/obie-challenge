import type { Request, Response } from 'express';
import { getTabByName } from '../services/sheetsService';

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