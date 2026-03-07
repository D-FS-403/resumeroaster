const FREE_ROASTS = 3;
const WINDOW_DAYS = 7;
const STORAGE_KEY = 'resumeroast_roasts';

interface RoastRecord {
  timestamp: number;
}

export function getRoastHistory(): RoastRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function canRoast(isPro: boolean): boolean {
  if (isPro) return true;
  
  const history = getRoastHistory();
  const now = Date.now();
  const windowMs = WINDOW_DAYS * 24 * 60 * 60 * 1000;
  
  const recentRoasts = history.filter(
    (r) => now - r.timestamp < windowMs
  );
  
  return recentRoasts.length < FREE_ROASTS;
}

export function getRemainingRoasts(isPro: boolean): number {
  if (isPro) return Infinity;
  
  const history = getRoastHistory();
  const now = Date.now();
  const windowMs = WINDOW_DAYS * 24 * 60 * 60 * 1000;
  
  const recentRoasts = history.filter(
    (r) => now - r.timestamp < windowMs
  );
  
  return Math.max(0, FREE_ROASTS - recentRoasts.length);
}

export function recordRoast(): void {
  if (typeof window === 'undefined') return;
  
  const history = getRoastHistory();
  const now = Date.now();
  const windowMs = WINDOW_DAYS * 24 * 60 * 60 * 1000;
  
  const recentRoasts = history.filter(
    (r) => now - r.timestamp < windowMs
  );
  
  recentRoasts.push({ timestamp: now });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentRoasts));
}

export function getResetDate(): Date {
  const history = getRoastHistory();
  if (history.length === 0) return new Date();
  
  const oldestInWindow = [...history]
    .sort((a, b) => a.timestamp - b.timestamp)[0];
  
  const resetTime = oldestInWindow.timestamp + (WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return new Date(resetTime);
}
