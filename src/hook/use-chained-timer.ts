import { useState, useCallback, useEffect, useMemo } from 'react';
import { ChainedTimer, ChainedTimerStatus } from '../lib/chained-timer';

function calcTotalElapsed(lapDurations: number[], currentLapRemain: number, currentLapIndex: number) {
  let elapsed = 0;
  for (let i = 0; i < currentLapIndex; i++) {
    elapsed += lapDurations[i];
  }
  elapsed += lapDurations[currentLapIndex] - currentLapRemain;
  return elapsed;
}

export type UseChainedTimerResult = {
  status: ChainedTimerStatus;
  currentLapRemain: number;
  currentLapIndex: number;
  totalElapsed: number;
  start: () => void;
  reset: () => void;
};

type ChainedTimerState = {
  status: ChainedTimerStatus;
  currentLapRemain: number;
  currentLapIndex: number;
  totalElapsed: number;
};

export function useChainedTimer(lapDurations: number[]): UseChainedTimerResult {
  const timer = useMemo(() => new ChainedTimer(lapDurations), [lapDurations]);

  const [state, setState] = useState<ChainedTimerState>({
    status: timer.status,
    currentLapRemain: timer.currentLapRemain,
    currentLapIndex: timer.currentLapIndex,
    totalElapsed: calcTotalElapsed(lapDurations, timer.currentLapRemain, timer.currentLapIndex),
  });
  const syncStateWithTimer = useCallback(() => {
    const { status, currentLapRemain, currentLapIndex } = timer;
    setState({
      status: status,
      currentLapRemain: currentLapRemain,
      currentLapIndex: currentLapIndex,
      totalElapsed: calcTotalElapsed(lapDurations, currentLapRemain, currentLapIndex),
    });
  }, [lapDurations, timer]);

  const start = useCallback(() => {
    timer.start();
    syncStateWithTimer();
  }, [syncStateWithTimer, timer]);
  const reset = useCallback(() => {
    timer.reset();
    syncStateWithTimer();
  }, [syncStateWithTimer, timer]);

  useEffect(() => {
    const unsubscribe = timer.addListener('tick', syncStateWithTimer);
    return unsubscribe;
  }, [syncStateWithTimer, timer]);

  return { ...state, start, reset };
}
