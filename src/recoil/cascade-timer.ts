import { atom, selector } from 'recoil';
import { TimerConfig } from '../component/molecules/timer/TimerConfigForm';
import { CascadeTimerStatus } from '../lib/timer/cascade-timer';

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
function calcTotalElapsed(lapDurations: number[], lapRemain: number, lapIndex: number): number {
  let elapsed = 0;
  for (let i = 0; i < lapIndex; i++) {
    elapsed += lapDurations[i];
  }
  elapsed += lapDurations[lapIndex] - lapRemain;
  return elapsed;
}

export const lapConfigsState = atom<TimerConfig['laps']>({
  key: 'cascade-timer/lapConfigsState',
  default: DEFAULT_LAP_CONFIGS,
});

export const lapDurationsState = selector<number[]>({
  key: 'cascade-timer/lapDurationsState',
  get: ({ get }) => {
    const lapConfigs = get(lapConfigsState);
    return lapConfigs.map((lapConfig) => lapConfig.duration);
  },
});

export const statusState = atom<CascadeTimerStatus>({
  key: 'cascade-timer/statusState',
  default: 'initial',
});

export const lapRemainState = atom<number>({
  key: 'cascade-timer/lapRemainState',
  default: 0,
});

export const lapIndexState = atom<number>({
  key: 'cascade-timer/lapIndexState',
  default: 0,
});

/** タイマーを開始してから現在までの経過時間. 値は `tick` イベントに合わせて更新される. */
export const totalElapsedState = selector({
  key: 'cascade-timer/totalElapsedState',
  get: ({ get }) => {
    const lapDurations = get(lapDurationsState);
    const lapRemain = get(lapRemainState);
    const lapIndex = get(lapIndexState);
    return calcTotalElapsed(lapDurations, lapRemain, lapIndex);
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

export const lapTitleState = selector<string>({
  key: 'cascade-timer/lapTitleState',
  get: ({ get }) => {
    const lapConfigs = get(lapConfigsState);
    const lapIndex = get(lapIndexState);
    return lapConfigs[lapIndex].title;
  },
});
