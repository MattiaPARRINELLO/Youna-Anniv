import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface SecretState {
  gem1: boolean;
  gem2: boolean;
  gem3: boolean;
  gem4: boolean;
  gem5: boolean;
  openWhenPortalsVisited: string[];
  openWhenLettersRevealed: string[];
  totalGems: number;
  sessionStartTime: number;
}

interface SecretContextType extends SecretState {
  unlockGem: (gem: 1 | 2 | 3 | 4 | 5) => void;
  markPortalVisited: (slug: string) => void;
  addRevealedLetter: (letter: string) => void;
  getMissingGems: () => number[];
  getFoundCount: () => number;
  getSessionDuration: () => number;
  resetAll: () => void;
  resetCount: number;
}

const STORAGE_KEY = 'youna-secrets';

function loadState(): SecretState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    gem1: false, gem2: false, gem3: false, gem4: false, gem5: false,
    openWhenPortalsVisited: [],
    openWhenLettersRevealed: [],
    totalGems: 0,
    sessionStartTime: Date.now(),
  };
}

const SecretContext = createContext<SecretContextType | null>(null);

export function SecretProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SecretState>(loadState);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const unlockGem = useCallback((gem: 1 | 2 | 3 | 4 | 5) => {
    setState(prev => {
      const key = `gem${gem}` as keyof SecretState;
      if (prev[key]) return prev;
      return { ...prev, [key]: true, totalGems: prev.totalGems + 1 };
    });
  }, []);

  const markPortalVisited = useCallback((slug: string) => {
    setState(prev => {
      if (prev.openWhenPortalsVisited.includes(slug)) return prev;
      return { ...prev, openWhenPortalsVisited: [...prev.openWhenPortalsVisited, slug] };
    });
  }, []);

  const addRevealedLetter = useCallback((letter: string) => {
    setState(prev => {
      if (prev.openWhenLettersRevealed.includes(letter)) return prev;
      return { ...prev, openWhenLettersRevealed: [...prev.openWhenLettersRevealed, letter] };
    });
  }, []);

  const getMissingGems = useCallback(() => {
    return ([1,2,3,4,5] as const).filter(g => !state[`gem${g}`]);
  }, [state]);

  const getFoundCount = useCallback(() => {
    return state.totalGems;
  }, [state.totalGems]);

  const getSessionDuration = useCallback(() => {
    return Math.floor((Date.now() - state.sessionStartTime) / 1000);
  }, [state.sessionStartTime]);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setState({
      gem1: false, gem2: false, gem3: false, gem4: false, gem5: false,
      openWhenPortalsVisited: [],
      openWhenLettersRevealed: [],
      totalGems: 0,
      sessionStartTime: Date.now(),
    });
    setResetCount(c => c + 1);
  }, []);

  return (
    <SecretContext.Provider value={{
      ...state,
      unlockGem,
      markPortalVisited,
      addRevealedLetter,
      getMissingGems,
      getFoundCount,
      getSessionDuration,
      resetAll,
      resetCount,
    }}>
      {children}
    </SecretContext.Provider>
  );
}

export function useSecrets() {
  const ctx = useContext(SecretContext);
  if (!ctx) throw new Error('useSecrets must be used within SecretProvider');
  return ctx;
}
