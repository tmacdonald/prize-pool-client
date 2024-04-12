export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) as T : null;
}

export function getList<T>(key: string): T[] {
  const item = getItem<T[]>(key);
  return item ?? [];
}