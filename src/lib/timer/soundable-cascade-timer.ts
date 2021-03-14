import { createSTEventTarget, STEventListenerOrEventListenerObject } from '@mizdra/strictly-typed-event-target';
import { CascadeTimer, CascadeTimerState, UnsubscribeFn } from './cascade-timer';
import { TimerController, OptimizedTimerController } from './timer-controller';

export type { UnsubscribeFn };

export type SoundableCascadeTimerEventMap = {
  /** カウントダウン中のメインタイマーが更新された時に発火するイベント. */
  mainTick: undefined;
  /** カウントダウン中のサウンドタイマーが更新された時に発火するイベント. */
  soundTick: undefined;
};
const [TimerCustomEvent, TimerEventTarget] = createSTEventTarget<SoundableCascadeTimerEventMap>();

/**
 * 音を鳴らすタイミングを文字盤の更新のタイミングからずらす機能を持った cascade-timer。
 * 音を鳴らすタイミングを管理するタイマー (サウンドタイマー) と文字盤用のタイマー (メインタイマー) を内部に持ち、
 * それぞれの tick イベントが発火すると、`soundTick` / `mainTick` イベントが発火するようになっている。
 *
 * あくまで `SoundableCascadeTimer` は音を鳴らすタイミングを `soundTick` イベントの発火により教えてくれるだけであり、
 * 名前に反して実際に音を鳴らしてくれる訳ではない点に注意。これらのイベントを subscribe して音を鳴らす責務は
 * `SoundableCascadeTimer` の利用側にある。
 */
export class SoundableCascadeTimer {
  readonly #emitter: typeof TimerEventTarget;
  readonly #mainTimer: CascadeTimer;
  readonly #soundTimer: CascadeTimer;
  #mainOffset: number;
  #soundOffset: number;

  /**
   * @param lapDurations ラップごとのカウントダウン時間
   */
  constructor(
    lapDurations: number[],
    mainOffset = 0,
    soundOffset = 0,
    controller: TimerController = new OptimizedTimerController(),
  ) {
    if (lapDurations.length == 0) throw new Error('インスタンスを作成するには少なくとも 1 つのラップが必要です.');
    this.#emitter = new TimerEventTarget();
    this.#mainTimer = new CascadeTimer(lapDurations, mainOffset, controller);
    this.#soundTimer = new CascadeTimer(lapDurations, mainOffset + soundOffset, controller);
    this.#mainOffset = mainOffset;
    this.#soundOffset = soundOffset;

    this.#mainTimer.addEventListener('tick', () => this.#emitter.dispatchEvent(new TimerCustomEvent('mainTick')));
    this.#soundTimer.addEventListener('tick', () => this.#emitter.dispatchEvent(new TimerCustomEvent('soundTick')));
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
    this.#mainTimer.start(startTime);
    this.#soundTimer.start(startTime);
  }
  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    this.#mainTimer.reset();
    this.#soundTimer.reset();
  }
  /** メインタイマーのオフセットを設定する. オフセットはカウントダウン中でもリアルタイムで反映されるため, 調律などに利用できる. */
  setMainOffset(mainOffset: number) {
    this.#mainOffset = mainOffset;
    this.#mainTimer.setOffset(mainOffset);
    this.#soundTimer.setOffset(mainOffset + this.#soundOffset);
  }
  /** サウンドタイマーのオフセットを設定する. オフセットはカウントダウン中でもリアルタイムで反映されるため, 調律などに利用できる. */
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
