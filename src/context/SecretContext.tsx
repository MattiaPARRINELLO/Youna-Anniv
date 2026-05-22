import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { trackEvent } from '../utils/tracker';

interface SecretState {
  gem1: boolean;
  gem2: boolean;
  gem3: boolean;
  gem4: boolean;
  gem5: boolean;
  gem6: boolean;
  gem7: boolean;
  openWhenPortalsVisited: string[];
  openWhenLettersRevealed: string[];
  totalGems: number;
  sessionStartTime: number;
}

interface SecretContextType extends SecretState {
  unlockGem: (gem: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  markPortalVisited: (slug: string) => void;
  addRevealedLetter: (letter: string) => void;
  getMissingGems: () => number[];
  getFoundCount: () => number;
  getSessionDuration: () => number;
  resetAll: () => void;
  resetCount: number;
}

function defaultState(): SecretState {
  return {
    gem1: false, gem2: false, gem3: false, gem4: false, gem5: false, gem6: false, gem7: false,
    openWhenPortalsVisited: [],
    openWhenLettersRevealed: [],
    totalGems: 0,
    sessionStartTime: Date.now(),
  };
}

const SecretContext = createContext<SecretContextType | null>(null);

export function SecretProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SecretState>(defaultState);
  const [resetCount, setResetCount] = useState(0);

  const unlockGem = useCallback((gem: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    setState(prev => {
      const key = `gem${gem}` as keyof SecretState;
      if (prev[key]) return prev;
      const newCount = prev.totalGems + 1;
      trackEvent(`gem_${gem}` as const);
      if (newCount === 7) {
        setTimeout(() => trackEvent('gem_all'), 500);
      }
      return { ...prev, [key]: true, totalGems: newCount };
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
    return ([1,2,3,4,5,6,7] as const).filter(g => !state[`gem${g}`]);
  }, [state]);

  const getFoundCount = useCallback(() => {
    return state.totalGems;
  }, [state.totalGems]);

  const getSessionDuration = useCallback(() => {
    return Math.floor((Date.now() - state.sessionStartTime) / 1000);
  }, [state.sessionStartTime]);

  const resetAll = useCallback(() => {
    setState(defaultState());
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
