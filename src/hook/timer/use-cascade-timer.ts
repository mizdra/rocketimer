import { useCallback, useEffect, useMemo } from 'react';
import { CascadeTimer } from '../../lib/timer/cascade-timer';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import {
  statusState,
  currentLapRemainState,
  currentLapIndexState,
  offsetState,
  lapDurationsState,
} from '../../recoil/cascade-timer';

export type UseCascadeTimerResult = {
  start: () => void;
  reset: () => void;
  setOffset: (newOffset: number) => void;
};

export function useCascadeTimer(): UseCascadeTimerResult {
  const lapDurations = useRecoilValue(lapDurationsState);

  const timer = useMemo(() => {
    const timer = new CascadeTimer(lapDurations);
    return timer;
  }, [lapDurations]);

  // 状態更新用の util 関数を定義
  const syncStateWithTimer = useRecoilCallback(
    ({ set }) => () => {
      const state = timer.getState();
      set(statusState, state.status);
      set(currentLapRemainState, state.currentLapRemain);
      set(currentLapIndexState, state.currentLapIndex);
      set(offsetState, state.offset);
    },
    [timer],
  );

  // タイマーを操作するAPIを定義
  const start = useCallback(() => {
    timer.start();
    syncStateWithTimer();
  }, [syncStateWithTimer, timer]);
  const reset = useCallback(() => {
    timer.reset();
    syncStateWithTimer();
  }, [syncStateWithTimer, timer]);
  const setOffsetForOuter = useCallback(
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

  return { start, reset, setOffset: setOffsetForOuter };
}
