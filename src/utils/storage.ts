const NAMESPACE = 'mineflow';

const makeKey = (key: string) => `${NAMESPACE}:${key}`;

export function setItem(key: string, value: string) {
  try {
    localStorage.setItem(makeKey(key), value);
  } catch {}
}

export function getItem(key: string): string | null {
  try {
    return localStorage.getItem(makeKey(key));
  } catch {
    return null;
  }
}

export function removeItem(key: string) {
  try {
    localStorage.removeItem(makeKey(key));
  } catch {}
}

export function setJSON<T>(key: string, value: T) {
  setItem(key, JSON.stringify(value));
}

export function getJSON<T>(key: string): T | null {
  const raw = getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}


