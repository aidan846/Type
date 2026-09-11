export const StorageKeys = {
  mode: "mode",
  wpm15: "bestWpm15",
  wpm30: "bestWpm30",
  wpm60: "bestWpm60",
  wpm120: "bestWpm120",
} as const;


export function setStorageItem(key: keyof typeof StorageKeys, value: string): void {
  const storageKey = StorageKeys[key];
  localStorage.setItem(storageKey, value);
}

export function getStorageItem(key: keyof typeof StorageKeys): string | null {
  const storageKey = StorageKeys[key];
  return localStorage.getItem(storageKey);
}