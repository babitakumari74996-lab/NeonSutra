import { useEffect, useRef, useState } from "react";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    return readStorage(key, fallback);
  });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — state still works in memory for this session.
    }
  }, [key, value]);
  return [value, setValue] as const;
}
