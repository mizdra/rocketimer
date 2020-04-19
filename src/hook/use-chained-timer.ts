import { useState, useCallback, useEffect, useMemo } from 'react';
import { ChainedTimer, ChainedTimerStatus } from '../lib/chained-timer';

function calcLapEndTimes(lapDurations: number[]): number[] {
  const lapEndTimes = new Array<number>(lapDurations.length);
  let acc = 0;
  for (let i = 0; i < lapDurations.length; i++) {
    acc += lapDurations[i];
    lapEndTimes[i] = acc;
  }
  return lapEndTimes;
}

function calcTotalElapsed(lapDurations: number[], currentLapRemain: number, currentLapIndex: number): number {
  let elapsed = 0;
  for (let i = 0; i < currentLapIndex; i++) {
    elapsed += lapDurations[i];
  }
  elapsed += lapDurations[currentLapIndex] - currentLapRemain;
  return elapsed;
}

export type UseChainedTimerResult = ChainedTimerState & {
  /**
   * タイマーの開始時刻を基準とした各ラップが終了するまでの所要時間.
   * @example `lapDurations` が `[1, 2, 3]` の時, `lapEndTimes` は `[1, 3, 6]` となる.
   * */
  lapEndTimes: number[];
  start: () => void;
  reset: () => void;
  setOffset: (newOffset: number) => void;
};

type ChainedTimerState = {
  status: ChainedTimerStatus;
  currentLapRemain: number;
  currentLapIndex: number;
  /** タイマーを開始してから現在までの経過時間. 値は `tick` イベントに合わせて更新される. */
  totalElapsed: number;
  offset: number;
};

export function useChainedTimer(lapDurations: number[]): UseChainedTimerResult {
  const { timer, lapEndTimes } = useMemo(() => {
    const timer = new ChainedTimer(lapDurations);
    const lapEndTimes = calcLapEndTimes(lapDurations);
    return { timer, lapEndTimes };
  }, [lapDurations]);

  const [state, setState] = useState<ChainedTimerState>({
    status: timer.status,
    currentLapRemain: timer.currentLapRemain,
    currentLapIndex: timer.currentLapIndex,
    totalElapsed: calcTotalElapsed(lapDurations, timer.currentLapRemain, timer.currentLapIndex),
    offset: timer.offset,
  });
  const syncStateWithTimer = useCallback(() => {
    const { status, currentLapRemain, currentLapIndex } = timer;
    setState({
      status: status,
      currentLapRemain: currentLapRemain,
      currentLapIndex: currentLapIndex,
      totalElapsed: calcTotalElapsed(lapDurations, currentLapRemain, currentLapIndex),
      offset: timer.offset,
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
  const setOffset = useCallback(
    (newOffset: number) => {
      timer.setOffset(newOffset);
      syncStateWithTimer();
    },
    [syncStateWithTimer, timer],
  );

  useEffect(() => {
    const unsubscribe = timer.addListener('tick', syncStateWithTimer);
    return unsubscribe;
  }, [syncStateWithTimer, timer]);

  return { ...state, lapEndTimes, start, reset, setOffset };
}
