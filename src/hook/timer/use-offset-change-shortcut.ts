import { useEffect } from 'react';
import { UseCascadeTimerResult } from './use-cascade-timer';

export function useOffsetChangeShortcut(timer: UseCascadeTimerResult) {
  const { offset, setOffset } = timer;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        setOffset(offset + 1000);
      }
      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        setOffset(offset - 1000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [offset, setOffset]);
}
