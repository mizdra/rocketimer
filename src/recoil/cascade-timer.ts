import { atom, selector } from 'recoil';
import { CascadeTimerStatus } from '../lib/timer/cascade-timer';
import { TimerConfig } from '../component/molecules/timer/TimerConfigForm';

const DEFAULT_LAP_CONFIGS: TimerConfig['laps'] = [
  { title: 'お湯が沸くまで', duration: 3 * 1000 },
  { title: 'カップラーメンができるまで', duration: 5 * 1000 },
  { title: 'お昼休みが終わるまで', duration: 10 * 1000 },
  { title: '定時まで', duration: 10 * 1000 },
  { title: '就寝まで', duration: 10000000 * 1000 },
];

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

export const lapConfigsState = atom<TimerConfig['laps']>({
  key: 'cascade-timer/lapConfigsState',
  default: DEFAULT_LAP_CONFIGS,
});

export const lapDurationsState = atom<number[]>({
  key: 'cascade-timer/lapDurationsState',
  default: [],
});

export const statusState = atom<CascadeTimerStatus>({
  key: 'cascade-timer/statusState',
  default: 'initial',
});

export const currentLapRemainState = atom<number>({
  key: 'cascade-timer/currentLapRemainState',
  default: 0,
});

export const currentLapIndexState = atom<number>({
  key: 'cascade-timer/currentLapIndeState',
  default: 0,
});

/** タイマーを開始してから現在までの経過時間. 値は `tick` イベントに合わせて更新される. */
export const totalElapsedState = selector({
  key: 'cascade-timer/totalElapsedState',
  get: ({ get }) => {
    const lapDurations = get(lapDurationsState);
    const currentLapRemain = get(currentLapRemainState);
    const currentLapIndex = get(currentLapIndexState);
    return calcTotalElapsed(lapDurations, currentLapRemain, currentLapIndex);
  },
});

export const offsetState = atom<number>({
  key: 'cascade-timer/offsetState',
  default: 0,
});

/**
 * タイマーの開始時刻を基準とした各ラップが終了するまでの所要時間.
 * @example `lapDurations` が `[1, 2, 3]` の時, `lapEndTimes` は `[1, 3, 6]` となる.
 * */
export const lapEndTimesState = selector<number[]>({
  key: 'cascade-timer/lapEndTimesState',
  get: ({ get }) => {
    const lapDurations = get(lapDurationsState);
    return calcLapEndTimes(lapDurations);
  },
});

export const currentLapTitleState = selector<string>({
  key: 'cascade-timer/currentLapTitleState',
  get: ({ get }) => {
    const lapConfigs = get(lapConfigsState);
    const currentLapIndex = get(currentLapIndexState);
    return lapConfigs[currentLapIndex].title;
  },
});
