import { useEffect } from 'react';
import { UseCascadeTimerResult } from './use-cascade-timer';
import { useRecoilValue } from 'recoil';
import { offsetState } from '../../recoil/cascade-timer';

export function useOffsetChangeShortcut(setOffset: UseCascadeTimerResult['setOffset']) {
  const offset = useRecoilValue(offsetState);
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
