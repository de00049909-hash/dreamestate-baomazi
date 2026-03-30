import { useState, useEffect } from "react";

export interface VisitorIdentity {
  name: string;
  avatar: string;
  token: string;
}

const STORAGE_KEY = "taoyuan_visitor_identity";

/** Generate a random unique token for the visitor */
function generateToken(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Hook to manage anonymous visitor identity via localStorage.
 * - First visit: identity is null, show setup dialog
 * - Subsequent visits: identity is loaded from localStorage
 */
export function useVisitorIdentity() {
  const [identity, setIdentity] = useState<VisitorIdentity | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VisitorIdentity;
        if (parsed.name && parsed.avatar && parsed.token) {
          setIdentity(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  const saveIdentity = (name: string, avatar: string) => {
    const newIdentity: VisitorIdentity = {
      name: name.trim(),
      avatar,
      token: identity?.token ?? generateToken(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity));
    setIdentity(newIdentity);
    return newIdentity;
  };

  const clearIdentity = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIdentity(null);
  };

  return { identity, isLoaded, saveIdentity, clearIdentity };
}
