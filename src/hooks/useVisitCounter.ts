import { useState, useEffect } from 'react';
import { trackEvent } from '../utils/tracker';

const STORAGE_KEY = 'youyou_visit_count';
let didIncrement = false;

function getCurrentCount(): number {
  return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
}

export function useVisitCounter() {
  const [count, setCount] = useState(getCurrentCount);

  useEffect(() => {
    if (didIncrement) return;
    didIncrement = true;

    const current = getCurrentCount();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCount(next);
    trackEvent('visit', `Visite n°${next}`);
  }, []);

  return count;
}
