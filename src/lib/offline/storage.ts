const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const storageGet = <T,>(key: string, fallback: T): T => {
  return safeParse<T>(localStorage.getItem(key), fallback);
};

export const storageSet = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};
