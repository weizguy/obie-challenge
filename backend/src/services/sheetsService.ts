import { parse } from 'csv-parse/sync';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// if spreadsheet is updated, update the GID here and add to .env
const TABS: Record<string, string> = {
  'auto': process.env.GID_AUTO_FIRE || '',
  'fire': process.env.GID_AUTO_FIRE || '',
  'flood': process.env.GID_FLOOD || '',
};

type SheetCache = {
  data: any[];
  lastFetched: Date;
};

const cache: Record<string, SheetCache> = {};
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

const fetchSheetData = async (gid: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const response = await fetch(url);
  const csv = await response.text();
  return parse(csv, { columns: true, skip_empty_lines: true });
};

const isCacheValid = (key: string) => {
  if (!cache[key]) return false;
  const age = Date.now() - cache[key].lastFetched.getTime();
  return age < CACHE_TTL_MS;
};

export const getTabByName = async (tabName: string) => {
  const key = Object.keys(TABS).find(k =>
    tabName.toLowerCase().includes(k.toLowerCase())
  );

  if (!key) throw new Error(`Tab not found for: ${tabName}`);

  if (!isCacheValid(key)) {
    console.log(`Cache miss for "${key}", fetching from Google Sheets...`);
    const data = await fetchSheetData(TABS[key]);
    cache[key] = { data, lastFetched: new Date() };
  } else {
    console.log(`Cache hit for "${key}"`);
  }

  return cache[key].data;
};

export const getTabData = async (gid: string) => {
  return fetchSheetData(gid);
};

// clear cache when spreadsheet is updated
export const clearCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('Sheet cache cleared');
};