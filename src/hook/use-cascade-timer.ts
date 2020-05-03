import { useState, useCallback, useEffect, useMemo } from 'react';
import { CascadeTimer, CascadeTimerStatus } from '../lib/timer/cascade-timer';

/**
 * タイマーの開始時刻を基準とした各ラップが終了するまでの所要時間を返す.
 * @example `lapDurations` が `[1, 2, 3]` の時, `[1, 3, 6]` を返す.
 * */
function calcLapEndTimes(lapDurations: number[]): number[] {
  const lapEndTimes = new Array<number>(lapDurations.length);
  let acc = 0;
  for (let i = 0; i < lapDurations.length; i++) {
    acc += lapDurations[i];
    lapEndTimes[i] = acc;
  }
  return lapEndTimes;
}

/** 総経過時間を算出する */
function calcTotalElapsed(lapDurations: number[], currentLapRemain: number, currentLapIndex: number): number {
  let elapsed = 0;
  for (let i = 0; i < currentLapIndex; i++) {
    elapsed += lapDurations[i];
  }
  elapsed += lapDurations[currentLapIndex] - currentLapRemain;
  return elapsed;
}

export type UseCascadeTimerResult = CascadeTimerState & {
  /**
   * タイマーの開始時刻を基準とした各ラップが終了するまでの所要時間.
   * @example `lapDurations` が `[1, 2, 3]` の時, `lapEndTimes` は `[1, 3, 6]` となる.
   * */
  lapEndTimes: number[];
  start: () => void;
  reset: () => void;
  setOffset: (newOffset: number) => void;
};

type CascadeTimerState = {
  status: CascadeTimerStatus;
  currentLapRemain: number;
  currentLapIndex: number;
  /** タイマーを開始してから現在までの経過時間. 値は `tick` イベントに合わせて更新される. */
  totalElapsed: number;
  offset: number;
};

export function useCascadeTimer(lapDurations: number[]): UseCascadeTimerResult {
  const { timer, lapEndTimes } = useMemo(() => {
    const timer = new CascadeTimer(lapDurations);
    const lapEndTimes = calcLapEndTimes(lapDurations);
    return { timer, lapEndTimes };
  }, [lapDurations]);

  // 状態と状態更新用の util 関数を定義
  const [state, setState] = useState<CascadeTimerState>(() => {
    const state = timer.getState();
    return {
      ...state,
      totalElapsed: calcTotalElapsed(lapDurations, state.currentLapRemain, state.currentLapIndex),
    };
  });
  const syncStateWithTimer = useCallback(() => {
    const state = timer.getState();
    setState({
      ...state,
      totalElapsed: calcTotalElapsed(lapDurations, state.currentLapRemain, state.currentLapIndex),
    });
  }, [lapDurations, timer]);

  // タイマーを操作するAPIを定義
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

  // lapDurations が変更されたら state も更新する
  useEffect(() => {
    syncStateWithTimer();
  }, [lapDurations, syncStateWithTimer]);

  // tick イベントが発火したら state を更新する
  useEffect(() => {
    const unsubscribe = timer.addListener('tick', syncStateWithTimer);
    return unsubscribe;
  }, [lapDurations, syncStateWithTimer, timer]);

  return { ...state, lapEndTimes, start, reset, setOffset };
}
