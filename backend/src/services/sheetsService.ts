import { parse } from 'csv-parse/sync';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const TAB_MAP: Record<string, string> = {
    'auto': '137794754',
    'fire': '137794754',
    'flood': '1431100651',
  };

  const getGidByName = (tabNames: string[]): string => {
    for (const name of tabNames) {
      const key = Object.keys(TAB_MAP).find(k => k.toLowerCase().includes(name.toLowerCase()));
      if (key) return TAB_MAP[key];
    }
    throw new Error(`No tab found matching: ${tabNames.join(', ')}`);
  };
  
  export const getTabByName = async (tabName: string) => {
    const tabNames = tabName.split(',').map(n => n.trim());
    const gid = getGidByName(tabNames);
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  
    const response = await fetch(url);
    const csv = await response.text();
  
    return parse(csv, { columns: true, skip_empty_lines: true });
  };



