import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import endedAudioPath from '../../audio/ended.mp3';
import tickTackAudioPath from '../../audio/ticktack.mp3';
import { SoundableCascadeTimer } from '../../lib/timer/soundable-cascade-timer';
import { TimerController } from '../../lib/timer/timer-controller';
import { statusState, lapRemainState, lapIndexState, offsetState, lapDurationsState } from '../../recoil/cascade-timer';

export type UseCascadeTimerResult = {
  start: () => void;
  reset: () => void;
  setOffset: (newOffset: number) => void;
};

export type Options = {
  offset?: number;
  soundOffset?: number;
  controller?: TimerController;
};

function useAudio(path: string) {
  const audio = useMemo(() => new Audio(path), [path]);
  const play = useCallback(async () => {
    await audio.play();
  }, [audio]);
  return { play };
}

export function useCascadeTimer(options: Options): UseCascadeTimerResult {
  const lapDurations = useRecoilValue(lapDurationsState);

  const timer = useMemo(() => {
    const timer = new SoundableCascadeTimer(lapDurations, options.offset, options.soundOffset, options.controller);
    return timer;
  }, [lapDurations, options.controller, options.offset, options.soundOffset]);

  // 状態更新用の util 関数を定義
  const syncStateWithTimer = useRecoilCallback(
    ({ set }) => () => {
      const state = timer.getMainState();
      set(statusState, state.status);
      set(lapRemainState, state.lapRemain);
      set(lapIndexState, state.lapIndex);
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
      timer.setMainOffset(newOffset);
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
    const unsubscribe = timer.addEventListener('remainChange', syncStateWithTimer);
    return unsubscribe;
  }, [lapDurations, syncStateWithTimer, timer]);

  // audio の再生
  const { play: playTickTack } = useAudio(tickTackAudioPath);
  const { play: playEndedAudio } = useAudio(endedAudioPath);
  useEffect(() => {
    const unsubscribe1 = timer.addEventListener('ticktack', () => void playTickTack());
    const unsubscribe2 = timer.addEventListener('ticktackEnded', () => void playEndedAudio());
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [lapDurations, playEndedAudio, playTickTack, syncStateWithTimer, timer]);

  return { start, reset, setOffset: setOffsetForOuter };
}
