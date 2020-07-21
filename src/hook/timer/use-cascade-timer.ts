import { useCallback, useEffect, useMemo } from 'react';
import { CascadeTimer } from '../../lib/timer/cascade-timer';
import { useSetRecoilState, useRecoilValue } from 'recoil';
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
  const setStatus = useSetRecoilState(statusState);
  const setCurrentLapRemain = useSetRecoilState(currentLapRemainState);
  const setCurrentLapIndex = useSetRecoilState(currentLapIndexState);
  const setOffset = useSetRecoilState(offsetState);

  const lapDurations = useRecoilValue(lapDurationsState);

  const timer = useMemo(() => {
    const timer = new CascadeTimer(lapDurations);
    return timer;
  }, [lapDurations]);

  // 状態更新用の util 関数を定義
  const syncStateWithTimer = useCallback(() => {
    const state = timer.getState();
    setStatus(state.status);
    setCurrentLapRemain(state.currentLapRemain);
    setCurrentLapIndex(state.currentLapIndex);
    setOffset(state.offset);
  }, [setCurrentLapIndex, setCurrentLapRemain, setOffset, setStatus, timer]);

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
