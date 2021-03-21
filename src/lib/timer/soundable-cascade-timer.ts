import { createSTEventTarget, STEventListenerOrEventListenerObject } from '@mizdra/strictly-typed-event-target';
import { CascadeTimer, CascadeTimerState, UnsubscribeFn } from './cascade-timer';
import { formatDuration } from './duration';
import { TimerController, OptimizedTimerController } from './timer-controller';

export type { UnsubscribeFn };

export type SoundableCascadeTimerEventMap = {
  /** カウントダウン中のタイマーが更新された時に発火するイベント. */
  remainChange: undefined;
  /** カウントダウン中のサウンドタイマーの秒の位が変わった時に発火するイベント。ただし秒の位が 0 になった時は発火しない。 */
  ticktack: undefined;
  /** カウントダウン中のサウンドタイマーの秒の位が 0 になった時に発火するイベント. */
  ticktackEnded: undefined;
};
const [TimerCustomEvent, TimerEventTarget] = createSTEventTarget<SoundableCascadeTimerEventMap>();

/**
 * 音を鳴らすタイミングを文字盤の更新のタイミングからずらす機能を持った cascade-timer。
 * 音を鳴らすタイミングを管理するタイマー (サウンドタイマー) と文字盤用のタイマー (メインタイマー) を内部に持ち、
 * それぞれの tick イベントが発火すると、`ticktack` / `ticktackEnded` / `remainChange` イベントが発火するようになっている。
 *
 * あくまで `SoundableCascadeTimer` は音を鳴らすタイミングを `ticktack` / `ticktackEnded` イベントの発火により教えてくれるだけであり、
 * 名前に反して実際に音を鳴らしてくれる訳ではない点に注意。これらのイベントを subscribe して音を鳴らす責務は
 * `SoundableCascadeTimer` の利用側にある。
 */
export class SoundableCascadeTimer {
  readonly #emitter: typeof TimerEventTarget;
  readonly #mainTimer: CascadeTimer;
  readonly #soundTimer: CascadeTimer;
  #mainOffset: number;
  #soundOffset: number;
  #prevSoundState: CascadeTimerState;

  /**
   * @param lapDurations ラップごとのカウントダウン時間
   */
  constructor(
    lapDurations: number[],
    mainOffset = 0,
    soundOffset = 0,
    controller: TimerController = new OptimizedTimerController(),
  ) {
    this.#emitter = new TimerEventTarget();
    this.#mainTimer = new CascadeTimer(lapDurations, mainOffset, controller);
    this.#soundTimer = new CascadeTimer(lapDurations, mainOffset + soundOffset, controller);
    this.#mainOffset = mainOffset;
    this.#soundOffset = soundOffset;
    this.#prevSoundState = this.#soundTimer.getState();

    this.#mainTimer.addEventListener('tick', () => this.#emitter.dispatchEvent(new TimerCustomEvent('remainChange')));
    this.#soundTimer.addEventListener('tick', () => {
      const newSoundState = this.#soundTimer.getState();
      const eventType = checkSoundEvent(this.#prevSoundState, newSoundState);
      if (eventType !== undefined) {
        this.#emitter.dispatchEvent(new TimerCustomEvent(eventType));
      }
      this.#prevSoundState = newSoundState;
    });
  }
  /** メインタイマーの状態を返す. */
  getMainState(): CascadeTimerState {
    return this.#mainTimer.getState();
  }
  /** サウンドタイマーの状態を返す. */
  getSoundState(): CascadeTimerState {
    return this.#soundTimer.getState();
  }
  /**
   * カウントダウンを開始する.
   * @param startTime タイマーの開始時刻. 指定しなければ `CascadeTimer#start` を呼び出した時間が用いられる.
   * */
  start(startTime?: number) {
    this.#soundTimer.reset();
    this.#mainTimer.start(startTime);
    this.#soundTimer.start(startTime);
  }
  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    this.#mainTimer.reset();
    this.#soundTimer.reset();
  }
  /** メインオフセットを設定する. オフセットはカウントダウン中でもリアルタイムで反映されるため, 調律などに利用できる. */
  setMainOffset(mainOffset: number) {
    this.#mainOffset = mainOffset;
    this.#mainTimer.setOffset(mainOffset);
    this.#soundTimer.setOffset(mainOffset + this.#soundOffset);
  }
  /** サウンドオフセットを設定する. オフセットはカウントダウン中でもリアルタイムで反映されるため, 調律などに利用できる. */
  setSoundOffset(soundOffset: number) {
    this.#soundOffset = soundOffset;
    this.#soundTimer.setOffset(this.#mainOffset + soundOffset);
  }
  /** イベントリスナを登録する. */
  addEventListener<T extends keyof SoundableCascadeTimerEventMap>(
    type: T,
    listener: STEventListenerOrEventListenerObject<SoundableCascadeTimerEventMap, T> | null,
    options?: boolean | AddEventListenerOptions,
  ): UnsubscribeFn {
    this.#emitter.addEventListener(type, listener, options);
    return () => {
      this.#emitter.removeEventListener(type, listener, options);
    };
  }
}

/** サウンドタイマーの状態の変化を見て、`ticktack` / `ticktackEnded` を発火すべきタイミングかどうかを判定する。 */
export function checkSoundEvent(
  prevSoundState: CascadeTimerState,
  newSoundState: CascadeTimerState,
): 'ticktack' | 'ticktackEnded' | undefined {
  const prevStatus = prevSoundState.status;
  const newStatus = newSoundState.status;
  const prevLapIndex = prevSoundState.lapIndex;
  const newLapIndex = newSoundState.lapIndex;
  const prevSeconds = formatDuration(prevSoundState.lapRemain).seconds;
  const newSeconds = formatDuration(newSoundState.lapRemain).seconds;
  const newLapRemain = newSoundState.lapRemain;
  if (prevStatus === 'countdowning' && newStatus === 'ended') {
    return 'ticktackEnded';
  } else if (newStatus === 'countdowning' && prevLapIndex !== newLapIndex) {
    return 'ticktackEnded';
  } else if (newStatus === 'countdowning' && prevSeconds !== newSeconds && newLapRemain < 10 * 1000) {
    return 'ticktack';
  }
  return undefined;
}
